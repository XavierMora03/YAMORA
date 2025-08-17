'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';


const PropertySearchForm = () => {
  const [location, setLocation] =useState('');
  const [propertyType, setPropertyType] =useState('All');
  
  const router = useRouter();
  const handleSubmit= (e)=>{
    e.preventDefault();

    if(location === '' && propertyType == 'All'){
      router.push('/properties');
    }else{
      const query=`?location=${location}&propertyType=${propertyType}`;
      router.push(`/properties/search-results${query}`)
    }
  }
return (
  <form 
    onSubmit={handleSubmit}
    className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
  >
    <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
      <label htmlFor="location" className="sr-only">Location</label>
      <input
        type="text"
        id="location"
        placeholder="Ubicación, calle, ciudad, código postal..."
        className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-purple-500"
        value={location}
        onChange={(e)=> setLocation(e.target.value)}
      />
    </div>
    <div className="w-full md:w-2/5 md:pl-2">
      <label htmlFor="property-type" className="sr-only">Property Type</label>
      <select
        id="property-type"
        className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-purple-500"
        value={propertyType}
        onChange={(e)=> setPropertyType(e.target.value)}
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
    <button
      type="submit"
      className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-500"
    >
      Buscar
    </button>
  </form>
);

}

export default PropertySearchForm;
