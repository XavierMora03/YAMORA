'use server';

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import {getSessionUser} from "@/utils/getSessionUser";
import {revalidatePath} from "next/cache";

async function deleteProperty(propertyId){
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userIdId){
        throw new Error('Se necesita un ID de usuario')
    }
    const {userId} sessionUser.userId;

    const property = await Property.findById(propertyId);
    if (!property) throw new Error('No se encontró la propiedad');

    //Verify ownership

    if(property.owner.toString() !== userId){
        throw new Error('Unauthorized');
    }

    const publicIds = property.images.map((imageUrl) => {
        const parts = imageUrl.split('/');
        return parts.at(-1).split('.').at(0)
    });

    if (publicIds.length > 0){
        for (let publicId of publicIds){
            await cloudinary.uploader.destroy('yamora/' + publicId);
        }
    }

    await property.deleteOne();

    revalidatePath('/', 'layout');
}

export default deleteProperty;