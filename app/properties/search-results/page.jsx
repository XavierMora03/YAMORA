import connectDB from "@/config/database"
import Property from "@/models/Property"
import { convertToSerializableObject } from "@/utils/convertToObject";
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import {FaArrowAltCircleLeft} from 'react-icons/fa';
import PropertySearchForm from "@/components/PropertySearchForm";

const SearchResultsPage = async ({searchParams: {location, propertyType}}) => {
    console.log(location,propertyType);
    await connectDB();
    const locationPattern = new RegExp(location,'i');
    let query = {
        $or: [
            {name: locationPattern},
            {description: locationPattern},
            {'location.street': locationPattern},
            {'location.city': locationPattern},
            {'location.state': locationPattern},
            {'location.zipcode': locationPattern},
        ]
    }

    if (propertyType && propertyType !== 'All'){
        const typePattern = new RegExp(propertyType, 'i');
        query.type = typePattern;
    }

    const propertiesQueryResults = await Property.find(query).lean();
    const properties = convertToSerializableObject(propertiesQueryResults);
    console.log(properties);

return (
    <>
      <section className='bg-purple-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <PropertySearchForm />
        </div>
      </section>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          <Link
            href='/properties'
            className='flex items-center text-purple-500 hover:underline mb-3'
          >
            <FaArrowAltCircleLeft className='mr-2 mb-1' /> Volver a propiedades
          </Link>
          <h1 className='text-2xl mb-4'>Resultados de busqueda</h1>
          {properties.length === 0 ? (
            <p>No se encontraron propiedades.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {properties.map((property) => (
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