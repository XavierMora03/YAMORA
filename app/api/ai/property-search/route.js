// app/api/ai/property-search/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export async function POST(req) {
  try {
    if (!OPENAI_KEY) {
      console.error("CRITICAL: OPENAI_API_KEY environment variable is not set.");
      return NextResponse.json({ error: "Server configuration error: OpenAI API key missing." }, { status: 500 });
    }

    const { prompt: userPrompt = "", limit: rawLimit = 12 } = await req.json();
    const limit = Math.max(1, Math.min(50, Number(rawLimit || 12)));

    if (!userPrompt.trim()) {
      return NextResponse.json({ error: "Falta el prompt del usuario" }, { status: 400 });
    }

    await connectDB(); // Ensure database connection

    const systemMessage = `
You are a strict JSON generator for MongoDB Property searches.
Use only fields from the Property schema:
name, description, type, location.city, location.state, location.zipcode, beds, baths, square_feet, amenities, rates.nightly, rates.weekly, rates.monthly, is_featured.

Detect common synonyms and simplify them to a single keyword:
"pet friendly", "acepta mascotas" → "mascotas"
"pileta", "alberca" → "Alberca"
"gym", "gimnasio" → "Gym"
"cerca de escuela", "escuela" → "escuela"
"balcón", "terraza" → "balcón"

use rates.monthly as default if not specified, unless the user says rates.nightly or rates.weekly 
Each word or concept must be searched in all text fields (name, description, amenities, location.city, location.state) using $regex and $options: "i". (NO EXCEPTIONS,SEARCH ALL TEXT FIELDS FOR EVERY KEY WORD)
Each keyword will be an independent OR.
For numeric filters (beds, baths, square_feet, rates), use $lt and $gt as appropriate.
Return only valid JSON, ready to be passed to Property.find().
Remember the type values: Todas, Apartamento, Estudio, Condominio, Casa, Cabina, Cuarto, Otro.
"depa", "departamento" → "Apartamento".
Do not return any text, explanation, or code fences. Only return JSON.
Use location filters only if it is an explicit city, state or zipcode, if it is not use name, description or amenities to search

Example:

User prompt:
"quiero un depa pet friendly con alberca en CDMX, menos de 15000 mensual y 2 habitaciones, cerca del ITESO"

Expected output:

{
  "type": { "$regex": "Apartamento", "$options": "i" },
  "rates.monthly": { "$lt": 15000 },
  "location.state": { "$regex": "CDMX", "$options": "i" },
  "beds": 2,
  "$or": [
    { "name": { "$regex": "mascotas", "$options": "i" } },
    { "description": { "$regex": "mascotas", "$options": "i" } },
    { "amenities": { "$regex": "mascotas", "$options": "i" } },
    { "name": { "$regex": "Alberca", "$options": "i" } },
    { "description": { "$regex": "Alberca", "$options": "i" } },
    { "amenities": { "$regex": "Alberca", "$options": "i" } },
    { "name": { "$regex": "ITESO", "$options": "i" } },
    { "description": { "$regex": "ITESO", "$options": "i" } },
    { "amenities": { "$regex": "ITESO", "$options": "i" } }
  ]
}
`;
    
    console.log("[LOG] Sending request to OpenAI with prompt:", userPrompt);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini", // Changed to a valid and efficient model
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt }
        ],
        max_completion_tokens: 1000,
        
        response_format: { type: "json_object" } // Crucial for getting JSON back
      })
    });

    // --- IMPORTANT: Check for non-OK response first ---
    if (!openaiResponse.ok) {
      const errorDetail = await openaiResponse.text(); // Read the raw error body
      console.error(`[ERROR] OpenAI API responded with status ${openaiResponse.status}:`, errorDetail);
      throw new Error(`Error de la API de OpenAI (Código ${openaiResponse.status}): ${errorDetail.substring(0, 200)}...`); // Limit length
    }

    const openaiData = await openaiResponse.json();
    console.log("[LOG] Raw OpenAI data received:", JSON.stringify(openaiData, null, 2));

    const jsonText = openaiData?.choices?.[0]?.message?.content;

    if (!jsonText) {
      console.error("[ERROR] OpenAI response did not contain expected message content:", openaiData);
      throw new Error("La respuesta de OpenAI no contiene contenido de mensaje esperado.");
    }

    console.log("[LOG] Content extracted from OpenAI (pre-parse):", jsonText);

    let filters;
    try {
      filters = JSON.parse(jsonText);
    } catch (err) {
      console.error("[ERROR] Error parseando JSON de OpenAI:", jsonText, err);
      throw new Error("OpenAI no devolvió JSON válido.");
    }
    
    console.log("[LOG] Parsed filters:", JSON.stringify(filters, null, 2));

    // Perform the database search
    const results = await Property.find(filters).limit(limit).lean();
    console.log(`[LOG] Found ${results.length} properties with filters.`)

    return NextResponse.json({
      parseSource: "openia",
      parsedFilters: filters,
      results
    });

  } catch (err) {
    console.error("[CRITICAL ERROR] Error en la ruta de búsqueda AI de propiedades:", err);
    // Ensure the frontend gets a readable error message
    return NextResponse.json({ error: err.message || "Error interno del servidor en búsqueda AI" }, { status: 500 });
  }
}