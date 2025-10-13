'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const PropertyAddForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      console.log('Submitting to API');
      const response = await fetch('/api/properties/add', {
        method: 'POST',
        body: formData,
      });

      console.log('API status:', response.status);
      console.log('API content-type:', response.headers.get('content-type'));
      
      const text = await response.text();
      console.log('API raw response:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error(`Server returned invalid response: ${text.substring(0, 100)}`);
      }
      
      console.log('API parsed data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la propiedad');
      }

      if (data.success && data.propertyId) {
        toast.success('Propiedad creada exitosamente');
        console.log('Redirecting to:', `/properties/${data.propertyId}`);
        
        // Navigate after showing toast
        setTimeout(() => {
          router.push(`/properties/${data.propertyId}`);
        }, 1000);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la propiedad');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-3xl text-center font-semibold mb-6'>Añadir propiedad</h2>

      <div className='mb-4'>
        <label htmlFor='type' className='block text-gray-700 font-bold mb-2'>
          Tipo de propiedad
        </label>
        <select
          id='type'
          name='type'
          className='border rounded w-full py-2 px-3'
          required
          disabled={isLoading}
        >
          <option value='Apartamento'>Apartamento</option>
          <option value='Condominio'>Condominio</option>
          <option value='Casa'>Casa</option>
          <option value='Cabina'>Cabina</option>
          <option value='Habitación'>Habitación</option>
          <option value='Estudio'>Estudio</option>
          <option value='Otro'>Otro</option>
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Nombre de la propiedad
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='ej. Bonito departamento en Tlajomulco.'
          required
          disabled={isLoading}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='description'
          className='block text-gray-700 font-bold mb-2'
        >
          Descripción
        </label>
        <textarea
          id='description'
          name='description'
          className='border rounded w-full py-2 px-3'
          rows='4'
          placeholder='Añade una descripción para tu propiedad'
          disabled={isLoading}
        ></textarea>
      </div>

      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>Ubicación</label>
        <input
          type='text'
          id='street'
          name='location.street'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Calle'
          required
          disabled={isLoading}
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Ciudad'
          required
          disabled={isLoading}
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Estado'
          required
          disabled={isLoading}
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Código postal'
          disabled={isLoading}
        />
      </div>

      <div className='mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/3 pr-2'>
          <label htmlFor='beds' className='block text-gray-700 font-bold mb-2'>
            Habitaciones
          </label>
          <input
            type='number'
            id='beds'
            name='beds'
            className='border rounded w-full py-2 px-3'
            required
            disabled={isLoading}
          />
        </div>
        <div className='w-full sm:w-1/3 px-2'>
          <label htmlFor='baths' className='block text-gray-700 font-bold mb-2'>
            Baños
          </label>
          <input
            type='number'
            id='baths'
            name='baths'
            className='border rounded w-full py-2 px-3'
            required
            disabled={isLoading}
          />
        </div>
        <div className='w-full sm:w-1/3 pl-2'>
          <label
            htmlFor='square_feet'
            className='block text-gray-700 font-bold mb-2'
          >
            Metros cuadrados
          </label>
          <input
            type='number'
            id='square_feet'
            name='square_feet'
            className='border rounded w-full py-2 px-3'
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Comodidades y servicios</label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          {['Wifi', 'Estufa', 'Lavadora', 'Estacionamiento', 'Alberca', 'Jacuzzi', 'Seguridad 24/7', 'Acceso para silla de ruedas', 'Elevador', 'Lavavajillas', 'Gym', 'Aire acondicionado', 'Balcón', 'Smart TV', 'Cafetera'].map((amenity) => (
            <div key={amenity}>
              <input
                type='checkbox'
                id={`amenity_${amenity}`}
                name='amenities'
                value={amenity}
                className='mr-2'
                disabled={isLoading}
              />
              <label htmlFor={`amenity_${amenity}`}>{amenity}</label>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Precio de Renta (Deje en blanco sino aplica)
        </label>
        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='flex items-center'>
            <label htmlFor='weekly_rate' className='mr-2'>
              Semanal
            </label>
            <input
              type='number'
              id='weekly_rate'
              name='rates.weekly'
              className='border rounded w-full py-2 px-3'
              disabled={isLoading}
            />
          </div>
          <div className='flex items-center'>
            <label htmlFor='monthly_rate' className='mr-2'>
              Mensual
            </label>
            <input
              type='number'
              id='monthly_rate'
              name='rates.monthly'
              className='border rounded w-full py-2 px-3'
              disabled={isLoading}
            />
          </div>
          <div className='flex items-center'>
            <label htmlFor='nightly_rate' className='mr-2'>
              Por noche
            </label>
            <input
              type='number'
              id='nightly_rate'
              name='rates.nightly'
              className='border rounded w-full py-2 px-3'
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label htmlFor='seller_name' className='block text-gray-700 font-bold mb-2'>
          Nombre del propietario
        </label>
        <input
          type='text'
          id='seller_name'
          name='seller_info.name'
          className='border rounded w-full py-2 px-3'
          placeholder='Name'
          disabled={isLoading}
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='seller_email' className='block text-gray-700 font-bold mb-2'>
          Email del propietario
        </label>
        <input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className='border rounded w-full py-2 px-3'
          placeholder='Email address'
          required
          disabled={isLoading}
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='seller_phone' className='block text-gray-700 font-bold mb-2'>
          Teléfono del propietario
        </label>
        <input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className='border rounded w-full py-2 px-3'
          placeholder='Phone'
          disabled={isLoading}
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='images' className='block text-gray-700 font-bold mb-2'>
          Imagenes (Seleccione hasta 4 imagenes)
        </label>
        <input
          type='file'
          id='images'
          name='images'
          className='border rounded w-full py-2 px-3'
          accept='image/*'
          multiple
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? 'Añadiendo propiedad...' : 'Añadir propiedad'}
        </button>
      </div>
    </form>
  );
};

export default PropertyAddForm;
