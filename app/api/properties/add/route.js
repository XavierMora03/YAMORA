import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import cloudinary from '@/config/cloudinary';

export async function POST(req) {
  try {
    console.log('API: POST /api/properties/add');

    const session = await getServerSession(authOptions);
    console.log('API: Session:', session?.user?.email);
    
    if (!session?.user?.id) {
      console.log('API: No session user ID');
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await req.formData();
    const userId = session.user.id;

    const amenities = formData.getAll('amenities') || [];
    const images = (formData.getAll('images') || []).filter(img => img?.name);

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos una imagen' },
        { status: 400 }
      );
    }

    console.log(`API: Uploading ${images.length} images`);
    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      try {
        const buffer = await images[i].arrayBuffer();
        const b64 = Buffer.from(buffer).toString('base64');
        const mimeType = images[i].type || 'image/png';

        const result = await cloudinary.uploader.upload(
          `data:${mimeType};base64,${b64}`,
          { 
            folder: 'yamora',
            timeout: 60000,
            resource_type: 'auto'
          }
        );

        imageUrls.push(result.secure_url);
        console.log(`API: Image ${i + 1} uploaded`);
      } catch (uploadErr) {
        console.error(`Image ${i + 1} error:`, uploadErr.message);
        return NextResponse.json(
          { error: `Error subiendo imagen ${i + 1}` },
          { status: 500 }
        );
      }
    }

    console.log('API: All images uploaded, creating property');

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
      beds: parseInt(formData.get('beds')) || 0,
      baths: parseInt(formData.get('baths')) || 0,
      square_feet: parseInt(formData.get('square_feet')) || 0,
      amenities,
      rates: {
        weekly: parseFloat(formData.get('rates.weekly')) || 0,
        monthly: parseFloat(formData.get('rates.monthly')) || 0,
        nightly: parseFloat(formData.get('rates.nightly')) || 0,
      },
      seller_info: {
        name: formData.get('seller_info.name') || '',
        email: formData.get('seller_info.email') || '',
        phone: formData.get('seller_info.phone') || '',
      },
      images: imageUrls,
      owner: userId,
    };

    const newProperty = new Property(propertyData);
    await newProperty.save();

    const propertyId = newProperty._id.toString();
    console.log('API: Property created:', propertyId);

    return NextResponse.json({
      success: true,
      propertyId: propertyId,
      message: 'Propiedad creada exitosamente'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
