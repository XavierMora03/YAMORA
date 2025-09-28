'use client';

import { useState } from "react";
import PropertyCard from "./PropertyCard";

export default function PropertySearchForm() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [useAI, setUseAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultMeta, setResultMeta] = useState(null); // parsedFilters, fallbackSteps, etc.
  const [items, setItems] = useState([]); // array of properties
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);

    // Classic search: redirect to existing search-results page
    if (!useAI) {
      const q = `?location=${encodeURIComponent(location)}&propertyType=${encodeURIComponent(propertyType)}`;
      window.location.href = `/properties/search-results${q}`;
      return;
    }

    // AI flow
    if (!aiPrompt.trim()) {
      setError("Escribe tu prompt de búsqueda para usar AI.");
      return;
    }

    setLoading(true);
    setItems([]);
    setResultMeta(null);

    try {
      const res = await fetch("/api/ai/property-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, limit: 12 })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Error en la búsqueda AI");
      }

      // Normalizar posible shapes:
      // - { parsedFilters, results: [...] }
      // - { results: [...] }
      // - [...] (array) (unlikely)
      let arr = [];
      if (Array.isArray(data.results)) arr = data.results;
      else if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data?.results?.results)) arr = data.results.results;
      else arr = [];

      // Ensure each property has images array to avoid errors in PropertyCard
      arr = arr.map(p => {
        if (!p) return p;
        if (!Array.isArray(p.images) || p.images.length === 0) {
          p.images = ["/placeholder.png"];
        }
        // ensure location object exists
        if (!p.location) p.location = { city: "", state: "" };
        return p;
      });

      setItems(arr);
      // keep metadata for debug/UI
      setResultMeta({
        parseSource: data.parseSource ?? null,
        parsedFilters: data.parsedFilters ?? null,
        fallbackSteps: data.fallbackSteps ?? null,
        finalFallback: data.finalFallback ?? null
      });

      // If API returned no items, show a helpful message
      if (!arr.length) {
        setError("No se encontraron propiedades.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <input
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Ubicación, calle, ciudad, código postal..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={useAI}
          />
          <select
            className="px-3 py-2 border rounded"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            disabled={useAI}
          >
            <option value="All">Todas</option>
            <option value="Apartment">Apartment</option>
            <option value="Studio">Studio</option>
            <option value="Condo">Condo</option>
            <option value="House">House</option>
            <option value="Cabin Or Cottage">Cabin Or Cottage</option>
            <option value="Room">Room</option>
            <option value="Other">Other</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useAI} onChange={() => setUseAI(!useAI)} />
            Buscar con AI
          </label>

          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded"
            disabled={loading}
          >
            {useAI ? (loading ? "Buscando..." : "Buscar con AI") : "Buscar"}
          </button>
        </div>

        {useAI && (
          <div className="mt-3">
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              placeholder='Ej: "Busco un depa cerca del Cucei con 2 habitaciones"'
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">Sé específico: Habitaciones, precio, amenidades, zona, lugares cercanos.</div>
          </div>
        )}
      </form>

      <div className="mt-6 bg-white rounded p-2">
        {loading && <div className="text-center p-4">Buscando propiedades…</div>}
        {error && <div className="text-red-600 p-2">{error}</div>}

        {resultMeta && (
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <div><strong>Fuente parseo:</strong> {resultMeta.parseSource ?? "n/a"}</div>
            {resultMeta.parsedFilters && (
              <div className="mt-2">
                <strong>Filtros detectados:</strong>
                <pre className="whitespace-pre-wrap text-xs mt-1 bg-white p-2 rounded">{JSON.stringify(resultMeta.parsedFilters, null, 2)}</pre>
              </div>
            )}
            {Array.isArray(resultMeta.fallbackSteps) && resultMeta.fallbackSteps.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">Fallback steps: {resultMeta.fallbackSteps.map(s => s.step || s.note || JSON.stringify(s)).join(" → ")}</div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {items.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

        {!loading && !items.length && !error && (
          <div className="text-gray-600  text-center p-4">Usa la búsqueda simple o activa "Buscar con AI".</div>
        )}
      </div>
    </div>
  );
}
