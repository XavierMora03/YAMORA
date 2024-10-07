"use client"

import '../../globals.css';
import React, { useState } from 'react'; // Asegúrate de importar useState

function Lectura() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false); // Usa useState en lugar de useFormState

    const fetchDataFromApi = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/auth/register", {
                headers: {
                    Accept: "application/json",
                    method: "GET"
                }
            });

            if (response.ok) { // Cambié `if(response)` a `if(response.ok)` para verificar si la respuesta es correcta
                const data = await response.json();
                console.log(data);
                setUsers(data.users);
            } else {
                console.error("Error en la respuesta de la API");
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    return (
    <>    
        <button onClick={fetchDataFromApi} disabled={loading} className="p-2 bg-blue-500 text-white rounded">
                {loading ? "Cargando..." : "Fetch Data"}    
        </button>

        <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Apellidos</th>
            <th className="py-2 px-4 border-b">Fecha de Nacimiento</th>
            <th className="py-2 px-4 border-b">Género</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">Dirección</th>
            <th className="py-2 px-4 border-b">Nombre de Usuario</th>
            <th className="py-2 px-4 border-b">Correo</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.nombre}</td>
                <td className="py-2 px-4 border-b">{user.apellidos}</td>
                <td className="py-2 px-4 border-b">{new Date(user.fecha_nacimiento).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{user.genero}</td>
                <td className="py-2 px-4 border-b">{user.telefono}</td>
                <td className="py-2 px-4 border-b">{user.direccion}</td>
                <td className="py-2 px-4 border-b">{user.nombre_usuario}</td>
                <td className="py-2 px-4 border-b">{user.correo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-4 px-6 text-center" colSpan="9">
                No hay usuarios disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    </>
    );


}

export default Lectura;
