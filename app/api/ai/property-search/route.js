
// app/api/ai/property-search/route.js
import { NextResponse } from "next/server";
import { pathToFileURL } from "url";
import connectDB from '@/config/database';
import Property from "@/models/Property";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn("OPENAI_API_KEY not set in environment.");
}

/**
 * Helper: call OpenAI Chat Completions to extract strict JSON filters.
 * We force a JSON-only output using a system instruction.
 */
async function callOpenAIParse(prompt) {
  const systemMessage = `
You are a JSON extractor. Given a user's natural language property search prompt,
return a single JSON object (no other commentary) with the following optional keys:
- beds_min, beds_max (integers)
- baths_min, baths_max (integers)
- max_nightly (number)
- min_nightly (number)
- amenities (array of strings)
- location_hint (string) // e.g. "Guadalajara, near Periferico"
- radius_km (number)
- free_text_query (string) // fallback / ranking query

If a value is not present in the prompt, omit it from the JSON. Output must be valid JSON only.
Example:
{"beds_min":2,"max_nightly":120,"amenities":["pool","wifi"],"location_hint":"Guadalajara"}
`;

  const userMessage = `User prompt: """${prompt}"""`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini", // pick a default model; change as needed
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_completion_tokens: 400,
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }
  const j = await resp.json();
  const content = j.choices?.[0]?.message?.content ?? "";

  // try to extract JSON substring if model put extra text
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    const jsonStr = content.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (e) {
      // fall through to throwing below
      throw new Error("Failed to parse JSON from OpenAI response: " + e.message);
    }
  }
  throw new Error("No JSON found in OpenAI response.");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = (body.prompt || "").toString().trim();
    const limit = body.limit ? Number(body.limit) : 10;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // connect to your DB and load models dynamically from project root
    await connectDB();


    // Call OpenAI to parse the prompt into JSON filters
    let filters = {};
    try {
      filters = await callOpenAIParse(prompt);
    } catch (err) {
      // If parsing fails, we'll fallback to semantic/text search using the raw prompt
      console.warn("OpenAI parse failed, falling back to text search:", err.message);
      filters = { free_text_query: prompt };
    }

    // Build mongoose query from parsed filters
    const query = {};
    const projection = {};
    const sort = {};

    // Beds
    if (filters.beds_min !== undefined) {
      query.beds = { ...(query.beds || {}), $gte: Number(filters.beds_min) };
    }
    if (filters.beds_max !== undefined) {
      query.beds = { ...(query.beds || {}), $lte: Number(filters.beds_max) };
    }

    // Baths
    if (filters.baths_min !== undefined) {
      query.baths = { ...(query.baths || {}), $gte: Number(filters.baths_min) };
    }
    if (filters.baths_max !== undefined) {
      query.baths = { ...(query.baths || {}), $lte: Number(filters.baths_max) };
    }

    // Price
    if (filters.min_nightly !== undefined || filters.max_nightly !== undefined) {
      query["rates.nightly"] = {};
      if (filters.min_nightly !== undefined) {
        query["rates.nightly"].$gte = Number(filters.min_nightly);
      }
      if (filters.max_nightly !== undefined) {
        query["rates.nightly"].$lte = Number(filters.max_nightly);
      }
      // clean empty
      if (Object.keys(query["rates.nightly"]).length === 0) {
        delete query["rates.nightly"];
      }
    } else if (filters.max_nightly !== undefined) {
      query["rates.nightly"] = { $lte: Number(filters.max_nightly) };
    }

    // Amenities: require all listed amenities
    if (Array.isArray(filters.amenities) && filters.amenities.length) {
      // match case-insensitive items in the array
      query.amenities = { $all: filters.amenities.map((a) => new RegExp(`^${escapeRegExp(a)}$`, "i")) };
    }

    // Location hint: we will try to match city, street, or zipcode using case-insensitive regex
    if (filters.location_hint) {
      const hint = filters.location_hint.trim();
      query.$or = [
        { "location.city": { $regex: hint, $options: "i" } },
        { "location.street": { $regex: hint, $options: "i" } },
        { "location.zipcode": { $regex: hint, $options: "i" } },
      ];
    }

    // Free text query: use Mongo text search if you created a text index (see notes).
    let useTextSearch = false;
    if (filters.free_text_query) {
      useTextSearch = true;
      query.$text = { $search: filters.free_text_query };
      projection.score = { $meta: "textScore" };
      sort.score = { $meta: "textScore" };
    }

    // If text search is not used, provide a default sort
    if (!useTextSearch) {
      // try sorting by featured and price ascending
      sort.is_featured = -1;
      sort["rates.nightly"] = 1;
    }

    // Execute query
    let cursor = Property.find(query, projection).limit(limit).sort(sort);

    const results = await cursor.exec();

    // Map results: expose relevant fields + a simple relevance score
    const mapped = results.map((p) => {
      const score = p?.score ?? null;
      return {
        _id: p._id,
        name: p.name,
        owner: p.owner,
        type: p.type,
        description: p.description,
        location: p.location,
        beds: p.beds,
        baths: p.baths,
        square_feet: p.square_feet,
        amenities: p.amenities,
        rates: p.rates,
        images: p.images,
        is_featured: p.is_featured,
        score,
      };
    });

    // Return structured filters + results for debug & UI
    return NextResponse.json({
      parsedFilters: filters,
      results: mapped,
    });
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

// small helper to escape regex
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
