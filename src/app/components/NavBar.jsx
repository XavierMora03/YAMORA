
import ImageMenu from "./ImageMenu"
import { BtnLink } from "./Variables"
import '../globals.css';
import Link from "next/link";

function NavBar() {
    return (
        <>
            <header className="text-black body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <div className="flex title-font font-medium items-center text-black mb-4 md:mb-0">
                        <Link href="/">
                            <img src="/images/casaicono.jpeg" alt="Icono_de_la_pagina" className="w-10 h-10 rounded-full" />
                        </Link>
                        <Link href="/">
                            <span className="ml-3 font-semihold ">Rentas Yamora</span>
                        </Link>
                    </div>
                    <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                        <Link href='/' className="BtnLink"><p>Inicio</p></Link>
                        <Link href='/renta' className="BtnLink">Mis rentas</Link>
                        <Link href="/guardados" className="BtnLink">Guardados</Link>
                    </nav>
                    <ImageMenu className="flex justify-center items-center h-screen bg-gray-100" />
                </div>
            </header>
            {/* <Outlet/> */}
        </>
    )
}

export default NavBar