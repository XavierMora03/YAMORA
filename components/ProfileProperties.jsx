'use client';
import { useState } from "react";
import connectDB from "@/config/database";
import Image from "next/image";
import Link from "next/link";
import deleteProperty from '@/app/actions/deleteProperty'

const ProfileProperties = ({properties:initialProperties}) => {
    const [properties, setProperties ] = useState(initialProperties)
    const handleDeleteProperty = async (propertyId) => {
        const confirmed = window.confirm('¿Seguro que quieres borrar esta propiedad?');
        if(!confirmed) return;
        await deleteProperty(propertyId);

        const updatedProperties = properties.filter(
            (property) => property._id !== propertyId
            );

        setProperties(updatedProperties);
    }
    return properties.map(property => (
            <div key={property._id} className="mb-10">
                <Link href={`/properties/${property._id}`}>
                    <Image
                    className="h-32 w-full rounded-md object-cover"
                    src={property.images[0]}
                    alt="Property 1"
                    width={1000}
                    height={200}
                    />
                </Link>
                <div className="mt-2">
                    <p className="text-lg font-semibold">{property.name}</p>
                    <p className="text-gray-600">{property.location.street}{property.location.city.state}</p>
                </div>
                <div className="mt-2">
                    <a
                    href="/add-property.html"
                    className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                    >
                    Edit
                    </a>
                    <button
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    type="button"
                    onClick={()=>handleDeleteProperty(property._id)}
                    >
                    Delete
                    </button>
                </div>
            </div>
            ));
    
}
 
export default ProfileProperties;