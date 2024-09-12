import { OpcionesMenu } from "./Variables"; 
import { useState } from "react";
import { Link } from "react-router-dom";
const ImageMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); //Estado que maneja el abrir el menu
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);//Variable que verifica la apertura del menú
    }
  
    return (
      <div className="relative inline-block text-left ">
        <img
          src="/images/perfil_icono.png"
          alt="Imagen con menú desplegable"
          onClick={toggleMenu}
          className="w-10 h-10 cursor-pointer rounded-full" //Imagen que abre el menu con el evento onClick
        /> 
        {isMenuOpen && ( //Función que contiene las opciones del menu
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg"> 
            <ul className="py-1">
              <li className={OpcionesMenu}>
                <Link to="/inicioSesion">Iniciar Sesión</Link>
              </li>
              <li className={OpcionesMenu}>
                <Link to="/registroUsuario">Registrarse</Link>
              </li>
              <li className={OpcionesMenu}>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className={OpcionesMenu}>
                <button className="btn-logout">Cerrar sesión</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  }

export default ImageMenu