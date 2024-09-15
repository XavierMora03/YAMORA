import { TituloFooter, DividirFooter, AmpliarInterlineadoLista } from "./Variables"
import Derechos from "./Derechos"
import { Link } from "react-router-dom"
const Footer = () => {
  return (
    <footer className="text-gray-500 body-font">
      <div className="container px-5 py-20 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">

        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img src="/images/casaicono.jpeg" alt="Icono_de_la_pagina" className="w-10 h-10 rounded-full" />
            <span className="ml-3 text-x1 ">Rentas Yamora</span>
          </div>
          <p className="mt-3 text-sm text-black">Un sitio web de casa de rentas</p>
        </div>

        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <div className={DividirFooter}>
            <h2 className={TituloFooter}>Explorar</h2>
            <nav className="list-none mb-10">
              <li className={AmpliarInterlineadoLista}>
                <Link to="/">Inicio</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/renta">Mis rentas</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/guardados">Guardados</Link>
              </li>
            </nav>
          </div>

          <div className={DividirFooter}>
            <h2 className={TituloFooter}>Contáctenos</h2>
            <nav className="list-none mb-10">
            <li className={AmpliarInterlineadoLista}>
                <Link to="/">Inicio</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/renta">Mis rentas</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/guardados">Guardados</Link>
              </li>
            </nav>
          </div>

          <div className={DividirFooter}>
            <h2 className={TituloFooter}>Redes sociales</h2>
            <nav className="list-none mb-10">
            <li className={AmpliarInterlineadoLista}>
                <Link to="/">Inicio</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/renta">Mis rentas</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/guardados">Guardados</Link>
              </li>
            </nav>
          </div>

          <div className={DividirFooter}>
            <h2 className={TituloFooter}>CATEGORIES</h2>
            <nav className="list-none mb-10">
            <li className={AmpliarInterlineadoLista}>
                <Link to="/">Inicio</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/renta">Mis rentas</Link>
              </li>
              <li className={AmpliarInterlineadoLista}>
                <Link to="/guardados">Guardados</Link>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <Derechos/>
    </footer>
  )
}

export default Footer