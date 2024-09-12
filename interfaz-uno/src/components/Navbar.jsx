import { Link, useLocation } from "react-router-dom"
import ImageMenu from "./ImageMenu"
import { BtnLink } from "./Variables"
const NavBar = () => {

  const {state} = useLocation()

  console.log(state)

  return (
    <>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <Link to="/">
              <img src="/images/casaicono.jpeg" alt="Icono_de_la_pagina" className="w-10 h-10 rounded-full" />
            </Link>
            <Link to="/">
              <span className="ml-3 font-semihold ">Rentas Yamora</span>
            </Link>
          </div>
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            <Link to="/" className={BtnLink}>Inicio</Link>
            <Link to="/renta" className={BtnLink}>Mis rentas</Link>
            <Link to="/guardados" className={BtnLink}>Guardados</Link>
          </nav>
          <div className="user">
            <span className="username mr-2">{state?.name}</span>
          </div>
          <ImageMenu className="flex justify-center items-center h-screen bg-gray-100" />
        </div>
      </header>
      {/* <Outlet/> */}
    </>
  )
}


export default NavBar