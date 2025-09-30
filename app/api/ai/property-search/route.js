import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn("OPENAI_API_KEY not set in environment.");
}

export async function POST(req) {
  try {
    const { prompt: userPrompt = "", limit: rawLimit = 12 } = await req.json();
    const limit = Math.max(1, Math.min(50, Number(rawLimit || 12)));

    if (!userPrompt.trim()) {
      return NextResponse.json({ error: "Falta el prompt del usuario" }, { status: 400 });
    }

    await connectDB();

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
  metros cuadrados es igual a square_feet, no hagas ninguna conversión y usa el numero que te de el usuario si lo especifica
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
    "beds": 2 
    "$or": [
      { "name": { "$regex": "mascotas", "$options": "i" } },
      { "description": { "$regex": "mascotas", "$options": "i" } },
      { "amenities": { "$regex": "mascotas", "$options": "i" } },
      { "name": { "$regex": "Alberca", "$options": "i" } },
      { "description": { "$regex": "Alberca", "$options": "i" } },
      { "amenities": { "$regex": "Alberca", "$options": "i" } },
      { "name": { "$regex": "ITESO", "$options": "i" } },
      { "description": { "$regex": "ITESO", "$options": "i" } },
      { "amenities": { "$regex": "ITESO", "$options": "i" } },

    ]
  }
  `;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userPrompt }
          ],
          temperature: 0
        })
      });

      const data = await response.json();
      const jsonText = data?.choices?.[0]?.message?.content;

      if (!jsonText) {
        throw new Error("No se recibió respuesta de OpenAI");
      }

      let filters;
      try {
        filters = JSON.parse(jsonText);
      } catch (err) {
        console.error("Error parseando JSON de OpenAI:", jsonText);
        throw new Error("OpenAI no devolvió JSON válido");
      }

      const results = await Property.find(filters).limit(limit).lean();

      return NextResponse.json({
        parseSource: "OpenAI",
      parsedFilters: filters,
      results
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
