import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import PropertySearchForm from '@/components/PropertySearchForm'
import connectDB from "@/config/database";
import Property from "@/models/Property"
import {convertToSerializableObject} from "@/utils/convertToObject";
import {FaArrowAltCircleLeft} from 'react-icons/fa';

const SearchResultsPage = async  ({searchParams: { location, propertyType}}) =>{
  await connectDB();
  const locationPattern = new RegExp(location,'i')

  let querty = {
    $or: [
      {name: locationPattern},
      {description: locationPattern},
      {'location.street': locationPattern},
      {'location.city': locationPattern},
      {'location.state': locationPattern},
      {'location.zipcode': locationPattern},
    ]
  } 

  if(propertyType && propertyType!== 'All'){
    const typePattern = new RegExp(propertyType, 'i')
    querty.type=typePattern;
  }

  const propertiesQuertyResults = await Property.find(querty).lean();
  const properties = convertToSerializableObject(propertiesQuertyResults);
  console.log(properties)
  console.log(location,propertyType);
  return (
    <>
    <section
      className="bg-purple-700 py-4"
    >
    <div
      className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8"
    >
      <PropertySearchForm/>
    </div>
    </section>

    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <Link href='/properties' 
        className='flexitems-center text-purple-500 hover:underline mb-3'
        >
          <FaArrowAltCircleLeft className='mr-2 mb-1'/> Regresar a propiedades
        </Link>
        <h1 className="text-2xl mb-4"> Resultados de Busqueda</h1>

        {properties.length === 0 ? (<p>Sin resultados de busqueda </p>):(
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property)=>(
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        </div>
    </section>
    </>
  );
}
export default SearchResultsPage;
