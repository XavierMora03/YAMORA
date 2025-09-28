'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PropertyCard = ({ p }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm flex gap-4">
      <img
        src={p.images?.[0] || '/placeholder.png'}
        alt={p.name}
        className="w-28 h-20 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{p.name}</h3>
        <p className="text-sm text-gray-600">{p.type} • {p.beds} bd • {p.baths} ba</p>
        <p className="text-sm mt-1">{p.location?.city ?? p.location?.street}</p>
        <p className="mt-2 font-medium">{p.rates?.nightly ? `$${p.rates.nightly} / night` : 'Price N/A'}</p>
      </div>
      {p.score != null && <div className="text-right text-sm">score: {Number(p.score).toFixed(2)}</div>}
    </div>
  );
};

const PropertySearchForm = () => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All');

  // AI-specific state
  const [useAI, setUseAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [aiError, setAiError] = useState(null);

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regular search (existing behaviour)
    if (!useAI) {
      if (location === '' && propertyType === 'All') {
        router.push('/properties');
      } else {
        const query = `?location=${encodeURIComponent(location)}&propertyType=${encodeURIComponent(propertyType)}`;
        router.push(`/properties/search-results${query}`);
      }
      return;
    }

    // AI search flow
    if (useAI) {
      if (!aiPrompt || aiPrompt.trim() === '') {
        setAiError("Please enter an AI search prompt.");
        return;
      }
      setAiError(null);
      setAiLoading(true);
      setAiResults(null);
      try {
        const resp = await fetch('/api/ai/property-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: aiPrompt, limit: 12 }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          setAiError(data?.error || 'Unknown error');
        } else {
          setAiResults(data);
        }
      } catch (err) {
        setAiError(err.message || String(err));
      } finally {
        setAiLoading(false);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-start gap-4"
      >
        <div className="w-full md:w-3/5 md:pr-2">
          <label htmlFor="location" className="sr-only">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Ubicación, calle, ciudad, código postal..."
            className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-purple-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={useAI}
          />
        </div>

        <div className="w-full md:w-2/5 md:pl-2">
          <label htmlFor="property-type" className="sr-only">Property Type</label>
          <select
            id="property-type"
            className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-purple-500"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            disabled={useAI}
          >
            <option value="All">Todas</option>
            <option value="Apartment">Departamento</option>
            <option value="Studio">Estudio</option>
            <option value="Condo">Condominio</option>
            <option value="House">Casa</option>
            <option value="Cabin Or Cottage">Cabina</option>
            <option value="Room">Cuarto</option>
            <option value="Other">Otro</option>
          </select>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useAI} onChange={() => setUseAI(!useAI)} />
            Buscar con AI
          </label>
        </div>

        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-500"
          >
            Buscar
          </button>
        </div>

        {/* AI prompt input (visible when useAI) */}
        {useAI && (
          <div className="w-full mt-3">
            <label htmlFor="ai-prompt" className="sr-only">AI prompt</label>
            <textarea
              id="ai-prompt"
              placeholder='E.g. "Busco un departamento romántico en Guadalajara, cerca de Periférico, 2 habitaciones, piscina y wifi, max $120 por noche"'
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-purple-500"
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <div className="text-sm text-gray-500 mt-2">Tip: be specific (beds, price, amenities, area, vibe).</div>
          </div>
        )}
      </form>

      {/* AI Results */}
      <div className="mt-6 max-w-2xl mx-auto">
        {aiLoading && <div className="text-center py-6">Buscando propiedades con AI…</div>}
        {aiError && <div className="text-red-600">{aiError}</div>}
        {aiResults?.parsedFilters && (
          <div className="mb-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
            <strong>Filtros detectados:</strong> <pre className="whitespace-pre-wrap">{JSON.stringify(aiResults.parsedFilters, null, 2)}</pre>
          </div>
        )}
        {aiResults?.results && aiResults.results.length > 0 && (
          <div className="space-y-3">
            {aiResults.results.map((p) => (
              <PropertyCard key={p._id} p={p} />
            ))}
          </div>
        )}
        {aiResults && Array.isArray(aiResults.results) && aiResults.results.length === 0 && (
          <div className="text-gray-600">No se encontraron propiedades que coincidan.</div>
        )}
      </div>
    </>
  );
};

export default PropertySearchForm;
