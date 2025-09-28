// app/api/ai/property-search/route.js
import { NextResponse } from "next/server";
import connectDB from '@/config/database';
import Property from "@/models/Property";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn("OPENAI_API_KEY not set in environment.");
}

/**
 * callOpenAIParse:
 * Instrucciones en español para que la LLM devuelva SÓLO un JSON
 * válido que podamos pasar directamente a Property.find()
 */
async function callOpenAIParse(prompt) {
  const systemMessage = `
Eres un experto en convertir prompts de búsqueda de propiedades a filtros de MongoDB.
Sigue exactamente estas reglas y devuelve SOLO un OBJETO JSON (nada más, sin comentarios ni texto adicional):

1) Usa únicamente campos del esquema Property:
   - name, description, type,
   - location.city, location.state, location.zipcode,
   - beds, baths, square_feet,
   - amenities,
   - rates.nightly, rates.weekly, rates.monthly,
   - is_featured

2) Detecta sinónimos comunes y normalízalos:
   - "pet friendly", "acepta mascotas" -> "mascotas"
   - "pileta", "alberca" -> "Alberca"
   - "gym", "gimnasio" -> "Gym"
   - "cerca de escuela", "escuela" -> "escuela"
   - "balcón", "terraza" -> "balcón"

3) Cada palabra o concepto (por ejemplo "mascotas", "Alberca", "CDMX", "balcón") debe convertirse en una serie de entradas que busquen en TODOS los campos de texto:
   name, description, amenities, location.city, location.state
   usando { "$regex": "<term>", "$options": "i" }.

4) Agrupa alternativas usando $or. Cada término es su propio conjunto de $or.
   Ejemplo: si el prompt contiene "mascotas" y "Alberca" -> genera $or para "mascotas", otro $or para "Alberca".

5) Para filtros numéricos (beds, baths, square_feet, rates.*) usa operadores $lt/$lte o $gt/$gte según el texto:
   - "menos de 15000 mensual", "hasta 15000" -> { "rates.monthly": { "$lt": 15000 } }
   - "más de 2 camas", ">= 2" -> { "beds": { "$gte": 2 } }
   Interpreta unidades: "por noche" -> rates.nightly, "mensual" -> rates.monthly, "por semana" -> rates.weekly.

6) Devuelve únicamente JSON válido que pueda pasarse directamente a Property.find().
   Usa sólo los operadores y campos permitidos ($regex, $options, $lt, $lte, $gt, $gte, $or, $and, $all).
   NO uses campos fuera de los permitidos ni operaciones peligrosas.
`;

  // User message — no backticks here to avoid breaking template literals
  const userMessage = `Por favor responde únicamente con JSON válido (sin texto adicional). Aquí está el prompt del usuario: ${prompt}`;

  const body = {
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    max_tokens: 500,
    temperature: 0.0,
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }

  const j = await resp.json();
  const content = j.choices?.[0]?.message?.content ?? "";

  // extraer el JSON entre la primera y última llave
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    const jsonStr = content.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (e) {
      throw new Error("No se pudo parsear JSON desde la respuesta del LLM: " + e.message);
    }
  }

  throw new Error("No JSON encontrado en la respuesta del LLM.");
}

/**
 * Validación estricta del objeto JSON devuelto por la LLM.
 * Se asegura que sólo se usen keys permitidas y operadores seguros.
 */
function isSafeMongoQuery(obj) {
  const ALLOWED_FIELDS = new Set([
    "name", "description", "type",
    "location.city", "location.state", "location.zipcode",
    "beds", "baths", "square_feet",
    "amenities",
    "rates.nightly", "rates.weekly", "rates.monthly",
    "is_featured"
  ]);

  const ALLOWED_TOP_LEVEL = new Set(["$or", "$and"]);

  const ALLOWED_OPERATORS = new Set(["$regex", "$options", "$lt", "$lte", "$gt", "$gte", "$all"]);

  function isFieldKey(k) {
    return ALLOWED_FIELDS.has(k);
  }

  function isOperator(k) {
    return ALLOWED_OPERATORS.has(k);
  }

  function recurse(value, parentKey = null) {
    if (value === null) return true;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (!recurse(item)) return false;
      }
      return true;
    }
    if (typeof value === "object") {
      for (const k of Object.keys(value)) {
        const v = value[k];

        // Top-level $or/$and
        if (ALLOWED_TOP_LEVEL.has(k)) {
          if (!Array.isArray(v)) return false;
          for (const clause of v) {
            if (typeof clause !== "object" || Array.isArray(clause)) return false;
            if (!recurse(clause)) return false;
          }
          continue;
        }

        // If key is a permitted field (can be dotted)
        if (isFieldKey(k)) {
          // Value can be primitive or object with operators
          if (typeof v === "object" && v !== null && !Array.isArray(v)) {
            for (const op of Object.keys(v)) {
              if (!isOperator(op)) return false;
              const val = v[op];
              if (op === "$options") {
                if (typeof val !== "string") return false;
              } else if (op === "$regex") {
                if (typeof val !== "string") return false;
              } else {
                // numeric operators
                if (typeof val !== "number") return false;
              }
            }
          } else {
            // primitive allowed (string, number, boolean)
            const t = typeof v;
            if (!["string", "number", "boolean"].includes(t)) return false;
          }
          continue;
        }

        // If key is an operator at an unexpected position
        if (isOperator(k)) {
          return false;
        }

        // Any other key is invalid
        return false;
      }
      return true;
    }
    return ["string", "number", "boolean"].includes(typeof value);
  }

  return recurse(obj);
}

/**
 * Fallback local parser: si la LLM falla o devuelve algo inseguro,
 * construimos un query simple siguiendo las reglas de sinónimos y ORs.
 */
function buildFallbackQuery(prompt) {
  const synonyms = {
    mascotas: ["pet friendly", "acepta mascotas", "mascotas"],
    Alberca: ["pileta", "alberca", "piscina", "pool"],
    Gym: ["gym", "gimnasio"],
    escuela: ["cerca de escuela", "escuela"],
    balcón: ["balcón", "terraza", "balcon"]
  };

  const textFields = ["name", "description", "amenities", "location.city", "location.state"];

  const lower = prompt.toLowerCase();

  const orClauses = [];

  // detect synonyms
  for (const [key, variants] of Object.entries(synonyms)) {
    for (const v of variants) {
      if (lower.includes(v)) {
        for (const field of textFields) {
          orClauses.push({ [field]: { $regex: escapeForRegex(key), $options: "i" } });
        }
        break;
      }
    }
  }

  // detect city/state tokens (simple words)
  const tokens = Array.from(new Set((lower.match(/[a-záéíóúñ]{3,}/gi) || []).map(t => t.trim())));
  const stop = new Set(["con","en","la","el","y","de","por","para","una","un","que","más","mas","menos","quiero","busco"]);
  for (const t of tokens) {
    if (stop.has(t)) continue;
    const matchedSyn = Object.values(synonyms).some(arr => arr.some(v => t.includes(v)));
    if (!matchedSyn) {
      for (const field of ["location.city", "location.state"]) {
        orClauses.push({ [field]: { $regex: escapeForRegex(t), $options: "i" } });
      }
    }
  }

  // numeric: detect "menos de X mensual" or "hasta X mensual"
  const currencyMatch = lower.match(/(?:menos de|hasta|<=|<)\s*\$?\s*([\d.,]+)/);
  const moreMatch = lower.match(/(?:más de|mas de|>=|>)\s*\$?\s*([\d.,]+)/);
  const betweenMatch = lower.match(/(?:entre)\s*\$?\s*([\d.,]+)\s*(?:y|-)\s*\$?\s*([\d.,]+)/);

  let query = {};
  if (betweenMatch) {
    const a = parseNumber(betweenMatch[1]);
    const b = parseNumber(betweenMatch[2]);
    if (!isNaN(a) && !isNaN(b)) {
      if (lower.includes("mensual") || lower.includes("mes")) {
        query["rates.monthly"] = { $gte: Math.min(a, b), $lte: Math.max(a, b) };
      } else if (lower.includes("noche") || lower.includes("por noche")) {
        query["rates.nightly"] = { $gte: Math.min(a, b), $lte: Math.max(a, b) };
      } else {
        query["rates.nightly"] = { $gte: Math.min(a, b), $lte: Math.max(a, b) };
      }
    }
  } else if (currencyMatch) {
    const num = parseNumber(currencyMatch[1]);
    if (!isNaN(num)) {
      if (lower.includes("mensual") || lower.includes("mes")) {
        query["rates.monthly"] = { $lt: num };
      } else if (lower.includes("noche") || lower.includes("por noche")) {
        query["rates.nightly"] = { $lt: num };
      } else if (lower.includes("semana")) {
        query["rates.weekly"] = { $lt: num };
      } else {
        query["rates.nightly"] = { $lt: num };
      }
    }
  } else if (moreMatch) {
    const num = parseNumber(moreMatch[1]);
    if (!isNaN(num)) {
      if (lower.includes("mensual") || lower.includes("mes")) {
        query["rates.monthly"] = { $gt: num };
      } else if (lower.includes("noche") || lower.includes("por noche")) {
        query["rates.nightly"] = { $gt: num };
      } else if (lower.includes("semana")) {
        query["rates.weekly"] = { $gt: num };
      } else {
        query["rates.nightly"] = { $gt: num };
      }
    }
  }

  if (orClauses.length) {
    query.$or = orClauses;
  }

  return query;
}

function parseNumber(s) {
  if (!s) return NaN;
  // Normalize "15,000" or "15.000" depending on format: remove thousands separators
  const cleaned = s.replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
  return parseFloat(cleaned);
}

function escapeForRegex(s) {
  return s.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = (body.prompt || "").toString().trim();
    const limit = body.limit ? Number(body.limit) : 10;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    await connectDB();

    // attempt LLM parse -> DB query object
    let parsedQuery;
    try {
      parsedQuery = await callOpenAIParse(prompt);

      if (!parsedQuery || typeof parsedQuery !== "object" || Array.isArray(parsedQuery)) {
        throw new Error("La LLM no devolvió un objeto JSON válido.");
      }

      // validate safety
      if (!isSafeMongoQuery(parsedQuery)) {
        throw new Error("El JSON devuelto por la LLM contiene campos u operadores no permitidos.");
      }

    } catch (llmErr) {
      console.warn("LLM parse failed or unsafe, using fallback parser:", llmErr.message);
      parsedQuery = buildFallbackQuery(prompt);
    }

    // default sort: featured first, luego precio nocturno asc (si existe)
    const sort = { is_featured: -1, "rates.nightly": 1 };

    // Execute the query
    const results = await Property.find(parsedQuery).limit(limit).sort(sort).lean().exec();

    return NextResponse.json({
      parsedFilters: parsedQuery,
      results,
    });
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
