'use client';
import addProperty from '@/app/actions/addProperty';

const PropertyAddForm = () => {
  return (
    <form action={addProperty}>
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
        >
          <option value='Apartamento'>Apartmento</option>
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
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Ciudad'
          required
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Estado'
          required
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Código postal'
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
          />
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Comodidades y servicios</label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          <div>
            <input
              type='checkbox'
              id='amenity_wifi'
              name='amenities'
              value='Wifi'
              className='mr-2'
            />
            <label htmlFor='amenity_wifi'>Wifi</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_kitchen'
              name='amenities'
              value='Estufa'
              className='mr-2'
            />
            <label htmlFor='amenity_kitchen'>Estufa</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_washer_dryer'
              name='amenities'
              value='Lavadora'
              className='mr-2'
            />
            <label htmlFor='amenity_washer_dryer'>Lavadora</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_free_parking'
              name='amenities'
              value='Estacionamiento'
              className='mr-2'
            />
            <label htmlFor='amenity_free_parking'>Estacionamiento</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_pool'
              name='amenities'
              value='Alberca'
              className='mr-2'
            />
            <label htmlFor='amenity_pool'>Alberca</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_hot_tub'
              name='amenities'
              value='Jacuzzi'
              className='mr-2'
            />
            <label htmlFor='amenity_hot_tub'>Jacuzzi</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_24_7_security'
              name='amenities'
              value='Seguridad 24/7'
              className='mr-2'
            />
            <label htmlFor='amenity_24_7_security'>Seguridad 24/7</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_wheelchair_accessible'
              name='amenities'
              value='Acceso para silla de ruedas'
              className='mr-2'
            />
            <label htmlFor='amenity_wheelchair_accessible'>
              Acceso para silla de ruedas
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_elevator_access'
              name='amenities'
              value='Elevador'
              className='mr-2'
            />
            <label htmlFor='amenity_elevator_access'>Elevador</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_dishwasher'
              name='amenities'
              value='Lavavajillas'
              className='mr-2'
            />
            <label htmlFor='amenity_dishwasher'>Lavavajillas</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_gym_fitness_center'
              name='amenities'
              value='Gym'
              className='mr-2'
            />
            <label htmlFor='amenity_gym_fitness_center'>
              Gym
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_air_conditioning'
              name='amenities'
              value='Aire acondicionado'
              className='mr-2'
            />
            <label htmlFor='amenity_air_conditioning'>Aire acondicionado</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_balcony_patio'
              name='amenities'
              value='Balcón'
              className='mr-2'
            />
            <label htmlFor='amenity_balcony_patio'>Balcón</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_smart_tv'
              name='amenities'
              value='Smart TV'
              className='mr-2'
            />
            <label htmlFor='amenity_smart_tv'>Smart TV</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_coffee_maker'
              name='amenities'
              value='Cafetera'
              className='mr-2'
            />
            <label htmlFor='amenity_coffee_maker'>Cafetera</label>
          </div>
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
            />
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label
          htmlFor='seller_name'
          className='block text-gray-700 font-bold mb-2'
        >
          Nombre del propietario
        </label>
        <input
          type='text'
          id='seller_name'
          name='seller_info.name'
          className='border rounded w-full py-2 px-3'
          placeholder='Name'
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_email'
          className='block text-gray-700 font-bold mb-2'
        >
          Email del propietario
        </label>
        <input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className='border rounded w-full py-2 px-3'
          placeholder='Email address'
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_phone'
          className='block text-gray-700 font-bold mb-2'
        >
          Teléfono del propietario
        </label>
        <input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className='border rounded w-full py-2 px-3'
          placeholder='Phone'
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
        />
      </div>

      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Añadir propiedad
        </button>
      </div>
    </form>
  );
};

export default PropertyAddForm;
