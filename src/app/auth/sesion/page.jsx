
import { TituloCuadroRegistro, TituloRegistro, CuadroRegistro } from "../../components/Variables"
import Derechos from "../../components/Derechos"
// import { useNavigate } from "react-router-dom"
import { EstiloEncabezado, EncabezadoIR } from "../../components/Variables"
import '../../globals.css';
import Link from "next/link";


export const metadata = {
    title: "Inicio de sesion",
}


function Sesion() {

    // const navigate = useNavigate()


    // const {nombre_de_usuario, email, password, onInputChange, onResetForm } = usuarioFormulario ({
    //     nombre_de_usuario: '',
    //     email: '',
    //     password: '',
    // })


    // const onInicioSesion = (e) => {
    //     e.preventDefault()

    //     navigate('/',{
    //         replace: true,
    //         state: {
    //             logged: true,
    //             nombre_de_usuario
    //         }
    //     })

    //     onResetForm();
    // }

    return (
        <>
            <section className="text-black body-font">
                <form action="">
                <div className="EstiloEncabezado">
                    <div className="EncabezadoIR">
                        <img src="/images/casaicono.jpeg" alt="Icono_de_la_pagina" className="w-10 h-10 rounded-full" />
                        <span className="ml-3 font-semihold ">Rentas Yamora</span>
                    </div>
                </div>
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">

                    <div className="bg-white rounded-lg p-8 flex flex-col  w-1/3 mx-auto  mt-10 md:mt-0">
                        <h1 className="TituloCuadroRegistro">INICIO DE SESIÓN</h1>
                        <div className="TituloRegistro">
                                <label htmlFor="nombre_usuario">Nombre de usuario</label>
                                <input type="text" name="nombre_usuario" id="nombre_usuario" required autoComplete="off" placeholder="Nombre de usuario" className="CuadroRegistro" />
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="correo">Correo electrónico</label>
                                <input type="email" name="correo" id="correo" required autoComplete="off" placeholder="Correo electrónico" className="CuadroRegistro" />
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="contrasena">Contraseña</label>
                                <input type="password" name="contrasena" id="contrasena" required autoComplete="off" placeholder="Contraseña" className="CuadroRegistro" />
                            </div>


                        <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Iniciar sesión</button>

                        <p className="mt-6">¿No estás registrado? <Link href="/auth/registro">Registrarse</Link></p>
                    </div>
                </div>
                </form>
            </section>
            <Derechos />
        </>
    )
}

export default Sesion