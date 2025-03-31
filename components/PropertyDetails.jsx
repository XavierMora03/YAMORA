import {Fatimes, FaBed, FaBath, FaRulerCombined, FaCheck, FaMapMarker} from 'react-icons/fa'

const PropertyDetails = ({property}) => {
    return ( <main>
        <div
          className="bg-white p-6 rounded-lg shadow-md text-center md:text-left"
        >
          <div className="text-gray-500 mb-4">{property.type}</div>
          <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
          <div
            className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start"
          >
            <i
              className="fa-solid fa-location-dot text-lg text-purple-700 mr-2"
            ></i>
            <p className="text-gray-700">
              {property.location.street} {property.location.city} {property.location.zipcode}
            </p>
          </div>

          <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
            Precio de renta
          </h3>
          <div className="flex flex-col md:flex-row justify-around">
            <div
              className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0"
            >
              <div className="text-gray-500 mr-2 font-bold">Semanal</div>
              <div className="text-2xl font-bold text-purple-500">{property.rates.weekly ? (
                `$${property.rates.weekly.toLocaleString()}`
              ) : (<div className="text-purple-500 mr-2 font-bold">No disponible</div>)}</div>
            </div>
            <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
              <div className="text-gray-500 mr-2 font-bold">Mensual</div>
              <div className="text-2xl font-bold text-purple-500">{property.rates.monthly ? (
                `$${property.rates.monthly.toLocaleString()}`
              ) : (<div className="text-purple-500 mr-2 font-bold">No disponible</div>)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-bold mb-6">Descripción y detalles</h3>
          <div
            className="flex justify-center gap-4 text-purple-500 mb-4 text-xl space-x-9"
          >
            <p>
              <FaBed className='inline-block mr-2'/> {property.beds}{' '}
              <span className="hidden sm:inline">Camas</span>
            </p>
            <p>
              <FaBath className='inline-block mr-2'/> {property.baths}{' '}
              <span className="hidden sm:inline">Baños</span>
            </p>
            <p>
              <FaRulerCombined className='inline-block mr-2'/> 
              {property.square_feet}{' '}<span className="hidden sm:inline">mt2</span>
            </p>
          </div>
          <p className="text-gray-500 mb-4">
            {property.description}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-bold mb-6">Servicios y comodidades</h3>

          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none"
          >
            {property.amenities.map((amenity, index)=>(
              <li key={index}>
                <i className="text-gray-500 mb-4"></i>{' '}{amenity}
              </li>
            ))}
          </ul>
        </div>
      
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div id="map"></div>
        </div>
      </main> );
}
 
export default PropertyDetails;