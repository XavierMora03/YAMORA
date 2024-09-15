import { Route, Routes } from "react-router-dom"
import NavBar from '../components/Navbar'
import Dashboard from "../pages/Dashboard"
import Guardados from "../pages/Guardados"
import Home from "../pages/Home"
import InicioSesion from '../pages/InicioSesion'
import RegistroUsuario from '../pages/RegistroUsuario'
import Renta from '../pages/Renta'

const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<NavBar/>}/>
                <Route index element={<Home/>}/>
                <Route path='inicioSesion' element={<InicioSesion/>}/>
                <Route path='dashboard' element={<Dashboard/>}/>
                <Route path='registroUsuario' element={<RegistroUsuario/>}/>
                <Route path='guardados' element={<Guardados/>}/>
                <Route path='renta' element={<Renta/>}/>
        </Routes>
    </>
  )
}

export default AppRouter