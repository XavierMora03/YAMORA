
'use server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

async function addProperty(formData) {
  try {
    console.log('=== START addProperty ===');
    
    await connectDB();
    console.log('✓ Database connected');

    const sessionUser = await getSessionUser();
    console.log('✓ Session user retrieved:', sessionUser?.userId);

    if (!sessionUser || !sessionUser.userId) {
      throw new Error('Se necesita un ID de usuario');
    }

    const userId = sessionUser.userId;

    // Access all values for amenities and images
    const amenities = formData.getAll('amenities');
    const images = formData.getAll('images').filter((image) => image.name !== '');

    console.log(`✓ Found ${images.length} images and ${amenities.length} amenities`);

    if (images.length === 0) {
      throw new Error('Debes seleccionar al menos una imagen');
    }

    console.log('⏳ Uploading images to Cloudinary...');

    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i];
      console.log(`📸 Processing image ${i + 1}/${images.length}: ${imageFile.name} (${imageFile.size} bytes)`);

      try {
        const imageBuffer = await imageFile.arrayBuffer();
        console.log(`  → Buffer created: ${imageBuffer.byteLength} bytes`);
        
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString('base64');
        
        console.log(`  → Base64 encoded: ${imageBase64.length} chars`);

        console.log(`  → Uploading to Cloudinary...`);
        
        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          {
            folder: 'yamora',
            timeout: 60000,
          }
        );

        imageUrls.push(result.secure_url);
        console.log(`✓ Image ${i + 1} uploaded: ${result.secure_url}`);
      } catch (uploadError) {
        const errorMsg = uploadError instanceof Error ? uploadError.message : String(uploadError);
        console.error(`✗ Error uploading image ${i + 1}:`, errorMsg);
        throw new Error(`Failed to upload image ${i + 1}: ${errorMsg}`);
      }
    }

    console.log('✓ All images uploaded successfully');
    console.log('⏳ Creating property in database...');

    // Create the propertyData object with embedded seller_info
    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities,
      rates: {
        weekly: formData.get('rates.weekly'),
        monthly: formData.get('rates.monthly'),
        nightly: formData.get('rates.nightly'),
      },
      seller_info: {
        name: formData.get('seller_info.name'),
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
      images: imageUrls,
      owner: userId,
    };

    console.log('Property data prepared:', {
      name: propertyData.name,
      type: propertyData.type,
      imagesCount: propertyData.images.length,
      owner: propertyData.owner,
    });

    const newProperty = new Property(propertyData);
    console.log('✓ Property document created');
    
    await newProperty.save();
    console.log(`✓ Property saved with ID: ${newProperty._id}`);

    console.log('⏳ Revalidating cache...');
    revalidatePath('/', 'layout');
    console.log('✓ Cache revalidated');

    console.log('🔄 Redirecting to property page...');
    redirect(`/properties/${newProperty._id}`);
    
  } catch (error) {
    // NEXT_REDIRECT is not a real error, it's how Next.js handles redirects
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('=== ERROR in addProperty ===');
    console.error('Message:', errorMessage);
    console.error('Stack:', errorStack);
    console.error('Full error:', error);
    console.error('=========================');
    
    throw error;
  }
}

export default addProperty;
