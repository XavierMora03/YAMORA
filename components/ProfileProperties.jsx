'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {toast} from 'react-toastify'
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
        toast.success('Propiedad eliminada con exito');
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
                    <p className="text-gray-600">{property.location.street}, {property.location.city}, {property.location.state}</p>
                </div>
                <div className="mt-2">
                    <Link
                    href={ `/properties/${property._id}/edit` }
                    className="bg-purple-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-purple-600"
                    >
                    Edit
                    </Link>
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