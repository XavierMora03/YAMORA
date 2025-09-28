// app/api/ai/property-search/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn("OPENAI_API_KEY not set in environment.");
}

/** ---------- Helper: call OpenAI to parse prompt -> JSON filter ---------- */
async function callOpenAIParse(prompt) {
  const systemMessage = `
You are a strict JSON filter generator for MongoDB. 
Return ONLY a single JSON object (no text, no code fences).
Use ONLY these allowed fields:
- name, description, type
- location.city, location.state, location.zipcode
- beds, baths, square_feet
- amenities
- rates.nightly, rates.weekly, rates.monthly
- is_featured
- $or, $and

Rules:
1. Text search terms → produce $or clauses with { "<field>": { "$regex": "<term>", "$options": "i" } } using:
   - name, description, amenities, location.city, location.state
2. Numeric filters:
   - ALWAYS prefer "rates.monthly" as the default unless user explicitly says nightly/weekly.
   - Use $lt, $lte, $gt, $gte with numbers (not strings).
   - Example: "menos de 11000" → { "rates.monthly": { "$lt": 11000 } }
3. Normalize synonyms into amenities:
   - "pet friendly","acepta mascotas" → "mascotas"
   - "pileta","alberca","piscina","pool" → "Alberca"
   - "gym","gimnasio" → "Gym"
   - "balcony","balcón","terraza" → "balcón"
4. If user says nothing relevant, return {}.
5. NEVER return fields or operators outside the allowed list. No $where, no JS, no explanations.
`;

  const userMessage = `Prompt: ${prompt}\nDevuelve únicamente el objeto JSON del filtro.`;

  const body = {
    model: "gpt-5",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage }
    ],
    max_tokens: 500,
    temperature: 0.0
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? "";

  const first = content.indexOf("{");
  const last = content.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("No JSON detected in LLM response.");
  const jsonStr = content.slice(first, last + 1);
  return JSON.parse(jsonStr);
}

/** ---------- Safety validation ---------- */
function isSafeMongoQuery(obj) {
  const ALLOWED_FIELDS = new Set([
    "name", "description", "type",
    "location.city", "location.state", "location.zipcode",
    "beds", "baths", "square_feet",
    "amenities",
    "rates.nightly", "rates.weekly", "rates.monthly",
    "is_featured"
  ]);
  const ALLOWED_TOP = new Set(["$or", "$and"]);
  const ALLOWED_OPS = new Set(["$regex", "$options", "$lt", "$lte", "$gt", "$gte", "$all"]);

  function check(node) {
    if (node === null) return true;
    if (Array.isArray(node)) return node.every(check);
    if (typeof node === "object") {
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (ALLOWED_TOP.has(k)) {
          if (!Array.isArray(v)) return false;
          if (!v.every(x => typeof x === "object" && !Array.isArray(x) && check(x))) return false;
          continue;
        }
        if (ALLOWED_FIELDS.has(k)) {
          if (typeof v === "object" && v !== null && !Array.isArray(v)) {
            for (const op of Object.keys(v)) {
              if (!ALLOWED_OPS.has(op)) return false;
              const val = v[op];
              if (op === "$options") { if (typeof val !== "string") return false; }
              else if (op === "$regex") { if (typeof val !== "string") return false; }
              else { if (typeof val !== "number") return false; }
            }
          } else {
            if (!["string", "number", "boolean"].includes(typeof v)) return false;
          }
          continue;
        }
        // reject anything else
        return false;
      }
      return true;
    }
    return ["string", "number", "boolean"].includes(typeof node);
  }

  return check(obj);
}

/** ---------- Local fallback parser (rules + synonyms) ---------- */
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

  // synonyms -> OR clauses
  for (const [norm, variants] of Object.entries(synonyms)) {
    if (variants.some(v => lower.includes(v))) {
      for (const f of textFields) orClauses.push({ [f]: { $regex: escapeForRegex(norm), $options: "i" } });
    }
  }

  // detect explicit type like "casa", "departamento", "studio", etc.
  const types = ["casa", "departamento", "estudio", "condominio", "room", "cuarto", "cabina", "cabin"];
  for (const t of types) {
    if (lower.includes(t)) {
      // capitalize type loosely for nicer regex (but case-insensitive)
      orClauses.push({ type: { $regex: t, $options: "i" } });
    }
  }

  // numeric patterns: between X and Y, less than, more than
  const between = lower.match(/entre\s*\$?\s*([\d.,]+)\s*(?:y|-)\s*\$?\s*([\d.,]+)/);
  const less = lower.match(/(?:menos de|hasta)\s*\$?\s*([\d.,]+)/);
  const more = lower.match(/(?:más de|mas de)\s*\$?\s*([\d.,]+)/);
  let query = {};

  if (between) {
    const a = parseNumber(between[1]), b = parseNumber(between[2]);
    if (!isNaN(a) && !isNaN(b)) query["rates.nightly"] = { $gte: Math.min(a, b), $lte: Math.max(a, b) };
  } else if (less) {
    const n = parseNumber(less[1]);
    if (!isNaN(n)) {
      if (lower.includes("mensual") || lower.includes("mes")) query["rates.monthly"] = { $lt: n };
      else if (lower.includes("semana")) query["rates.weekly"] = { $lt: n };
      else query["rates.nightly"] = { $lt: n };
    }
  } else if (more) {
    const n = parseNumber(more[1]);
    if (!isNaN(n)) {
      if (lower.includes("mensual") || lower.includes("mes")) query["rates.monthly"] = { $gt: n };
      else if (lower.includes("semana")) query["rates.weekly"] = { $gt: n };
      else query["rates.nightly"] = { $gt: n };
    }
  }

  // city/state tokens
  const tokens = Array.from(new Set((lower.match(/[a-záéíóúñ]{3,}/gi) || []).map(t => t.trim())));
  const stop = new Set([
    "a",
    "acá",
    "ahí",
    "ajena",
    "ajeno",
    "ajenas",
    "ajenos",
    "al",
    "algo",
    "algún",
    "alguna",
    "alguno",
    "algunos",
    "algunas",
    "allá",
    "allí",
    "ambos",
    "ante",
    "antes",
    "aquel",
    "aquella",
    "aquello",
    "aquellas",
    "aquellos",
    "aquí",
    "arriba",
    "así",
    "atrás",
    "aun",
    "aunque",
    "bajo",
    "bastante",
    "bien",
    "cabe",
    "cada",
    "casi",
    "cierto",
    "cierta",
    "ciertos",
    "ciertas",
    "como",
    "con",
    "conmigo",
    "conseguimos",
    "conseguir",
    "consigo",
    "consigue",
    "consiguen",
    "consigues",
    "contigo",
    "contra",
    "cual",
    "cuales",
    "cualquier",
    "cualquiera",
    "cualquieras",
    "cuan",
    "cuando",
    "cuanto",
    "cuanta",
    "cuantos",
    "cuantas",
    "de",
    "dejar",
    "del",
    "demás",
    "demasiada",
    "demasiado",
    "demasiadas",
    "demasiados",
    "dentro",
    "desde",
    "donde",
    "dos",
    "el",
    "él",
    "ella",
    "ello",
    "ellas",
    "ellos",
    "empleáis",
    "emplean",
    "emplear",
    "empleas",
    "empleo",
    "en",
    "encima",
    "entonces",
    "entre",
    "era",
    "eras",
    "eramos",
    "eran",
    "eres",
    "es",
    "esa",
    "ese",
    "eso",
    "esas",
    "esos",
    "esta",
    "estas",
    "estaba",
    "estado",
    "estáis",
    "estamos",
    "están",
    "estar",
    "este",
    "esto",
    "estos",
    "estoy",
    "etc",
    "fin",
    "fue",
    "fueron",
    "fui",
    "fuimos",
    "gueno",
    "ha",
    "hace",
    "haces",
    "hacéis",
    "hacemos",
    "hacen",
    "hacer",
    "hacia",
    "hago",
    "hasta",
    "incluso",
    "intenta",
    "intentas",
    "intentáis",
    "intentamos",
    "intentan",
    "intentar",
    "intento",
    "ir",
    "jamás",
    "junto",
    "juntos",
    "la",
    "lo",
    "los",
    "las",
    "largo",
    "más",
    "me",
    "menos",
    "mi",
    "mis",
    "mía",
    "mías",
    "mientras",
    "mío",
    "míos",
    "misma",
    "mismo",
    "mismas",
    "mismos",
    "modo",
    "mucha",
    "muchas",
    "muchísima",
    "muchísimo",
    "muchísimas",
    "muchísimos",
    "mucho",
    "muchos",
    "muy",
    "nada",
    "ni",
    "ningún",
    "ninguna",
    "ninguno",
    "ningunos",
    "ningunas",
    "no",
    "nos",
    "nosotras",
    "nosotros",
    "nuestra",
    "nuestro",
    "nuestras",
    "nuestros",
    "nunca",
    "os",
    "otra",
    "otro",
    "otras",
    "otros",
    "para",
    "parecer",
    "pero",
    "poca",
    "poco",
    "pocas",
    "pocos",
    "podéis",
    "podemos",
    "poder",
    "podría",
    "podrías",
    "podríais",
    "podríamos",
    "podrían",
    "por",
    "por qué",
    "porque",
    "primero",
    "puede",
    "pueden",
    "puedo",
    "pues",
    "que",
    "qué",
    "querer",
    "quién",
    "quienes",
    "quienesquiera",
    "quienquiera",
    "quizá",
    "quizás",
    "sabe",
    "sabes",
    "saben",
    "sabéis",
    "sabemos",
    "saber",
    "se",
    "según",
    "ser",
    "si",
    "sí",
    "siempre",
    "siendo",
    "sin",
    "sino",
    "so",
    "sobre",
    "sois",
    "solamente",
    "solo",
    "sólo",
    "somos",
    "soy",
    "sr",
    "sra",
    "sres",
    "sta",
    "su",
    "sus",
    "suya",
    "suyo",
    "suyas",
    "suyos",
    "tal",
    "tales",
    "también",
    "tampoco",
    "tan",
    "tanta",
    "tanto",
    "tantas",
    "tantos",
    "te",
    "tenéis",
    "tenemos",
    "tener",
    "tengo",
    "ti",
    "tiempo",
    "tiene",
    "tienen",
    "toda",
    "todo",
    "todas",
    "todos",
    "tomar",
    "trabaja",
    "trabajo",
    "trabajáis",
    "trabajamos",
    "trabajan",
    "trabajar",
    "trabajas",
    "tras",
    "tú",
    "tu",
    "tus",
    "tuya",
    "tuyo",
    "tuyas",
    "tuyos",
    "último",
    "ultimo",
    "un",
    "una",
    "uno",
    "unas",
    "unos",
    "usa",
    "usas",
    "usáis",
    "usamos",
    "usan",
    "usar",
    "uso",
    "usted",
    "ustedes",
    "va",
    "van",
    "vais",
    "valor",
    "vamos",
    "varias",
    "varios",
    "vaya",
    "verdadera",
    "vosotras",
    "vosotros",
    "voy",
    "vuestra",
    "vuestro",
    "vuestras",
    "vuestros",
    "y",
    "ya",
    "yo",
    "quiero",
    "busco",
    "alla"
]);
  for (const t of tokens) {
    if (stop.has(t)) continue;
    // avoid adding if token is a synonym already handled
    if (Object.values(synonyms).flat().some(v => t.includes(v))) continue;
    // add as city/state match
    orClauses.push({ "location.city": { $regex: escapeForRegex(t), $options: "i" } });
    orClauses.push({ "location.state": { $regex: escapeForRegex(t), $options: "i" } });
  }

  if (orClauses.length) query.$or = orClauses;
  return query;
}

function parseNumber(s) {
  if (!s) return NaN;
  const cleaned = s.replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
  return parseFloat(cleaned);
}
function escapeForRegex(s) {
  return s.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

/** ---------- Broaden a query: drop numeric/amenities constraints to increase recall ---------- */
function broadenQuery(q) {
  if (!q || typeof q !== "object") return {};
  const clone = JSON.parse(JSON.stringify(q));
  // remove numeric constraints
  ["beds", "baths", "square_feet", "rates.nightly", "rates.weekly", "rates.monthly"].forEach(k => {
    if (clone[k]) delete clone[k];
  });
  // remove amenities exact matches
  if (clone.amenities) delete clone.amenities;
  // keep text $or if exists; otherwise empty obj
  return clone;
}

/** ---------- Route handler ---------- */
export async function POST(req) {
  try {
    const { prompt: rawPrompt = "", limit: rawLimit = 10 } = await req.json();
    const prompt = String(rawPrompt || "").trim();
    const limit = Math.max(1, Math.min(50, Number(rawLimit || 10)));

    if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    await connectDB();

    let parsedQuery;
    let parseSource = "llm";
    try {
      parsedQuery = await callOpenAIParse(prompt);
      if (!parsedQuery || typeof parsedQuery !== "object" || Array.isArray(parsedQuery)) {
        throw new Error("Invalid JSON from LLM");
      }
      if (!isSafeMongoQuery(parsedQuery)) throw new Error("Unsafe LLM query");
    } catch (err) {
      // fallback local
      parseSource = "fallback_local";
      parsedQuery = buildFallbackQuery(prompt);
    }

    // try original query
    let results = await Property.find(parsedQuery).limit(limit).lean().exec();

    // progressive fallback: broaden query if no results
    let fallbackSteps = [];
    if (!results || results.length === 0) {
      const broadened = broadenQuery(parsedQuery);
      if (JSON.stringify(broadened) !== JSON.stringify(parsedQuery)) {
        fallbackSteps.push({ step: "broadened", query: broadened });
        results = await Property.find(broadened).limit(limit).lean().exec();
      }
    }

    // next fallback: text search on prompt across name/description/amenities
    if (!results || results.length === 0) {
      const textOr = [
        { name: { $regex: escapeForRegex(prompt), $options: "i" } },
        { description: { $regex: escapeForRegex(prompt), $options: "i" } },
        { amenities: { $regex: escapeForRegex(prompt), $options: "i" } },
        { "location.city": { $regex: escapeForRegex(prompt), $options: "i" } },
      ];
      const textQuery = { $or: textOr };
      fallbackSteps.push({ step: "text_search_prompt", query: textQuery });
      results = await Property.find(textQuery).limit(limit).lean().exec();
    }

    // final fallback: always return at least one property (featured first, otherwise cheapest)
    let finalFallback = false;
    if (!results || results.length === 0) {
      finalFallback = true;
      const single = await Property.findOne({}).sort({ is_featured: -1, "rates.nightly": 1 }).lean().exec();
      if (single) results = [single];
      else results = [];
      fallbackSteps.push({ step: "final_fallback_return_single", note: "returned top featured or cheapest property" });
    }

    // include helpful metadata for debugging/UI
    return NextResponse.json({
      parseSource,
      parsedFilters: parsedQuery,
      fallbackSteps,
      finalFallback,
      results: results.slice(0, limit)
    });
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
