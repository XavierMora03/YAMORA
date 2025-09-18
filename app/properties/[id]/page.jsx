import PropertyDetails from '@/components/PropertyDetails';
import PropertyImages from '@/components/PropertyImages';
import mongoose from "mongoose";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import Link from 'next/link';
import BookmarkButton from '@/components/BookmarksButton';
import PropertyContactForm from '@/components/PropertyContactForm';
import ShareButton from '@/components/ShareButton';
import {FaArrowLeft} from 'react-icons/fa';
import { convertToSerializableObject } from '@/utils/convertToObject';
const PropertyPage = async ({ params }) => {
  await connectDB();

  const awaitedParams = await Promise.resolve(params);
  const propertyDoc = await Property.findById(awaitedParams.id).lean()
  const property = convertToSerializableObject(propertyDoc);

  // const awaitedParams = await Promise.resolve(params);
  // const propertyId = awaitedParams.id || awaitedParams._id;


  // let property;

 

  // if (mongoose.Types.ObjectId.isValid(propertyId)) {
  //   property = await Property.findById(propertyId).lean();
  // } else {

  //   property = await Property.collection.findOne({ _id: propertyId });
  // }

  if (!property) {
     return <div className='text-center test-2xl font-bold mt-10'>Propiedad no encontrada</div>;
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
            
              <PropertyDetails property={property}/>
              <aside className='space-y-4'>
                <BookmarkButton property={property}></BookmarkButton>
                {/* <ShareButton property={property}></ShareButton> */}
                <PropertyContactForm property={property}></PropertyContactForm>
              </aside>
            
          </div>
          </div>
          </section>
      <PropertyImages images={property.images} />
    </>
  );
};

export default PropertyPage;



