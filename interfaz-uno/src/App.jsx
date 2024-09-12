import './App.css'
import Layaout from './components/Layaout'
import NavBar from './components/Navbar'
import Bloques from './components/Bloques'
import Footer from './components/Footer'
import CuadroBusqueda from './components/CuadroBusqueda'
import RegistroUsuario from './pages/RegistroUsuario'
import InicioSesion from './pages/InicioSesion'
import Dashboard from './pages/Dashboard'
import AppRouter from './router/AppRouter'

function App() {
  return(
  <>
  <div className='bg-secondary min-h-screen'>
    <AppRouter/>
    {/* <NavBar></NavBar>
    <CuadroBusqueda/>
    <Layaout>
    <p>Taylor Swift es la peor CANTANTE de la HISTORIA</p>
    <p></p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum vitae harum quas, ipsum dignissimos nesciunt quaerat quasi, minus labore dolore eaque corrupti molestiae libero obcaecati voluptatibus ipsam atque doloremque dolores.</p>
    </Layaout>
    <Bloques/>
    <Footer/>
    <RegistroUsuario/>
    <InicioSesion/>
    <Dashboard/> */}
  </div>
  </> //Componente que contiene todas las funciones y las interfaces creadas para el sitio web
  )
}

export default App
