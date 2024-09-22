import NavBar from "../components/NavBar"
import CuadroBusqueda from "../components/CuadroBusqueda"
import Footer from "../components/Footer"


export const metadata = {
    title: "Renta",
    description: "Este la pagina de rentas de mi proyecto",
}



function RentaLayout({children}) {
    return (
        <>
        <NavBar/>
        <CuadroBusqueda/>
        <Footer/>
        {children}
        </>
    )
}

export default RentaLayout