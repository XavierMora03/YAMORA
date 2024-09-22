import NavBar from "../components/NavBar";
import CuadroBusqueda from "../components/CuadroBusqueda"
import Footer from "../components/Footer"


export const metadata = {
  title: "Guardados",
  description: "Esta es la pagina de guardados de mi proyecto",

}

function GuardadosLayout() {
    return (
      <>
      <NavBar/>
      <CuadroBusqueda/>
      <Footer/>
      </>
    )
  }
  
  export default GuardadosLayout
