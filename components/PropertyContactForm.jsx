'use client';
import { useEffect } from 'react';
import { useActionState } from 'react'; // 👈 cambia aquí
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import addMessage from '@/app/actions/addMessage';
import { FaPaperPlane } from 'react-icons/fa';
import SubmitMessageButton from './SubmitMessageButton';

const PropertyContactForm = ({ property }) => {
  const { data: session } = useSession();
  const [state, formAction] = useActionState(addMessage, {}); // 👈 cambia aquí

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.submitted) toast.success('Mensaje enviado correctamente');
  }, [state]);

  if (state.submitted) {
    return <p className="text-green- mb-4">Tu mensaje fue enviado</p>;
  }

  return (
    session && (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-6">Contactar al dueño de la propiedad</h3>
        <form action={formAction}>
          <input
            type="hidden"
            id="property"
            name="property"
            defaultValue={property._id}
          />
          <input
            type="hidden"
            id="recipient"
            name="recipient"
            defaultValue={property.owner}
          />

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Nombre:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Ingresa tu correo"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Teléfono:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              name="phone"
              type="text"
              placeholder="Ingresa tu número telefónico"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="message"
            >
              Mensaje:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
              id="message"
              name="message"
              placeholder="Escribe tu mensaje"
            ></textarea>
          </div>

          <div>
            <SubmitMessageButton/>
          </div>
        </form>
      </div>
    )
  );
};

export default PropertyContactForm;
