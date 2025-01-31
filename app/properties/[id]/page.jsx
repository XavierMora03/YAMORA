import properties from '@/properties.json';
import PropertyHeaderImage from '@/components/PropertyHeaderImage';
import {FaBed, FaBath, FaRulerCombined, FaMoneyBill, FaMapMarker, FaMarker} from 'react-icons/fa'

const PropertyPage = ({ params }) => {
    console.log("ID recibido:", params.id);
    console.log("Lista de IDs en JSON:", properties.map(p => p._id));

    // Buscar la propiedad usando `_id`, asegurándonos de que coincidan los tipos de datos
    const property = properties.find(p => p._id === params.id) || 
                     properties.find(p => p._id === String(params.id));

    if (!property) {
        return <section>Propiedad no encontrada</section>;
    }

    return (
        
        <section>
            
            <div className="rounded-xl shadow-md relative">
            <PropertyHeaderImage image={property.images[0]}/>
        <div className="p-4">
          <div className="text-left md:text-center lg:text-left mb-6">
            <div className="text-gray-600">{property.type}</div>
            <h3 className="text-xl font-bold">{property.name}</h3>
            <p>{property.description}</p>
          </div>
         
          

          <div className="flex justify-center gap-4 text-gray-500 mb-4">
            <p>
              <i className="fa-solid fa-bed"></i> <FaBed className="md:hidden lg:inline"/>{' '}{property.beds}{' '}
              <span className="md:hidden lg:inline">Cuartos</span>
            </p>
            <p>
              <FaBath className="md:hidden lg:inline"/>{' '}{property.baths}{' '}
              <span className="md:hidden lg:inline">Baños</span>
            </p>
            <p>
            <FaRulerCombined className="md:hidden lg:inline"/>
              {' '}{property.square_feet} <span className="md:hidden lg:inline">mt2</span>
            </p>
          </div>

          {/* <div
            className="flex justify-center gap-4 text-green-900 text-sm mb-4"
          >
            <p><FaMoneyBill className="md:hidden lg:inline"/>{' '} Mensual</p>
            <p><FaMoneyBill className="md:hidden lg:inline"/>{' '} Anual</p>
          </div> */}

          <div className="border border-gray-100 mb-5"></div>

          <div className="flex flex-col lg:flex-row justify-between mb-4">
            <div className="flex align-middle gap-2 mb-4 lg:mb-0">
              <FaMapMarker className='text-orange-700 mt-1'/>
              <span className="text-orange-700"> {property.location.city}{' '}{property.location.state}</span>
            </div>
          </div>
        </div>
      </div> 
            {/* <h1 className="text-xl font-bold">{property.name}</h1>
            <p>{property.description}</p>
            <div className="flex justify-center gap-4 text-gray-500 mb-4">
            <p>
              <i className="fa-solid fa-bed"></i> <FaBed className="md:hidden lg:inline"/>{' '}{property.beds}{' '}
              <span className="md:hidden lg:inline">Cuartos</span>
            </p>
            <p>
              <FaBath className="md:hidden lg:inline"/>{' '}{property.baths}{' '}
              <span className="md:hidden lg:inline">Baños</span>
            </p>
            <p>
            <FaRulerCombined className="md:hidden lg:inline"/>
              {' '}{property.square_feet} <span className="md:hidden lg:inline">mt2</span>
            </p>
          </div> */}
        </section>
    );
}

export default PropertyPage;
