"use client";
import '../globals.css';
import { useState } from "react";
import Link from 'next/link';

function ImageMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className="relative inline-block text-left">
            <img
                src="/images/perfil_icono.png"
                alt="Imagen con menú desplegable"
                onClick={toggleMenu}
                className="w-10 h-10 cursor-pointer rounded-full"
            />
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <ul className="py-1">
                        <li className="OpcionesMenu">
                            <Link href='/auth/sesion'>
                                <p className="px-4 py-2 hover:bg-gray-100">Iniciar Sesión</p>
                            </Link>
                        </li>
                        <li className="OpcionesMenu">
                            <Link href='/auth/registro'>
                                <p className="px-4 py-2 hover:bg-gray-100">Registrarse</p>
                            </Link>
                        </li>
                        <li className="OpcionesMenu">
                            <Link href='/dashboard'>
                                <p className="px-4 py-2 hover:bg-gray-100">Dashboard</p>
                            </Link>
                        </li>
                        <li className="OpcionesMenu">
                            <button className="btn-logout px-4 py-2 w-full text-left">Cerrar sesión</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ImageMenu;
