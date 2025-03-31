import PropertyDetails from '@/components/PropertyDetails';
import mongoose from "mongoose";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import Link from 'next/link';
import {FaArrowLeft} from 'react-icons/fa';

const PropertyPage = async ({ params }) => {
  await connectDB();
  const awaitedParams = await Promise.resolve(params);
  console.log("Params recibidos:", awaitedParams);


  const propertyId = awaitedParams.id || awaitedParams._id;
  console.log("ID obtenido:", propertyId);

  let property;

  if (mongoose.Types.ObjectId.isValid(propertyId)) {
    property = await Property.findById(propertyId).lean();
  } else {

    property = await Property.collection.findOne({ _id: propertyId });
  }

  if (!property) {
    return <div>Propiedad no encontrada</div>;
  }

  return (
    <>
      <PropertyHeaderImage image={property.images?.[0]} />
      <section>
        <div className="container m-auto py-6 px-6">
          <Link href="/properties" className="text-purple-500 hover:text-purple-600 flex items-center">
            <FaArrowLeft className='mr-2'/> Volver a propiedades
          </Link>
        </div>
      </section>
      <section className="bg-purple-50">
      <div className="container m-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
          <div>
            <PropertyDetails property={property}/>
          </div>
        </div>
        </div>
        </section>
      
    </>
  );
};

export default PropertyPage;



