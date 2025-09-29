'use client';

import { useState, useRef } from "react";
import PropertyCard from "./PropertyCard";
import LoadingBar from 'react-top-loading-bar';

export default function PropertySearchForm() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [useAI, setUseAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const loadingBarRef = useRef(null);
  const aiInputRef = useRef(null);

  const handleModeChange = (isAiMode) => {
    setUseAI(isAiMode);
    if (isAiMode) {
      setTimeout(() => aiInputRef.current?.focus(), 0);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);

    if (!useAI) {
      if (!location.trim() && propertyType === 'All') {
        setError("Por favor, introduce una ubicación o selecciona un tipo de propiedad.");
        return;
      }
      const q = `?location=${encodeURIComponent(location)}&propertyType=${encodeURIComponent(propertyType)}`;
      window.location.href = `/properties/search-results${q}`;
      return;
    }

    if (!aiPrompt.trim()) {
      setError("Escribe tu búsqueda para usar la Búsqueda con IA.");
      return;
    }

    setLoading(true);
    setItems([]);
    loadingBarRef.current.continuousStart();

    try {
      const res = await fetch("/api/ai/property-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, limit: 12 })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error en la búsqueda AI");

      let arr = Array.isArray(data.results) ? data.results : [];
      arr = arr.map(p => p ? {
        ...p,
        images: (p.images && p.images.length > 0) ? p.images : ["/placeholder.png"],
        location: p.location || { city: "", state: "" }
      } : p).filter(Boolean);

      setItems(arr);

      if (!arr.length) setError("No se encontraron propiedades con esos criterios.");

    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <LoadingBar color='#8B5CF6' ref={loadingBarRef} shadow={true} />

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-center mb-4 border-b">
          <button
            onClick={() => handleModeChange(false)}
            className={`px-6 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 ease-in-out ${!useAI ? 'border-b-2 border-purple-600 text-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
          >
            Búsqueda Normal
          </button>
          <button
            onClick={() => handleModeChange(true)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 ease-in-out ${useAI ? 'border-b-2 border-purple-600 text-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
          >
            Búsqueda con IA ✨
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!useAI ? (
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <input
                className="flex-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Ubicación, calle, ciudad..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <select
                className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value='Apartamento'>Apartamento</option>
                <option value='Condominio'>Condominio</option>
                <option value='Casa'>Casa</option>
                <option value='Cabina'>Cabina</option>
                <option value='Habitación'>Habitación</option>
                <option value='Estudio'>Estudio</option>
                <option value='Otro'>Otro</option>
              </select>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          ) : (
            <div>
              <textarea
                ref={aiInputRef}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                rows={3}
                placeholder='Ej: "Busco un depa amueblado cerca de CUCEI por menos de 13k"'
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                  Sé específico: Habitaciones, precio, amenidades, zona, etc.
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
                  disabled={loading}
                >
                  {loading ? "Buscando..." : "Buscar con AI"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* --- RESULTS --- */}
      <div className="mt-6">
        {error && <div className="text-center text-red-600 p-4 bg-red-50 rounded-md">{error}</div>}

        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded p-2">
            {items.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {!loading && !items.length && !error && (
          <div className="text-gray-500 text-center p-8">
          </div>
        )}
      </div>
    </div>
  );
}
