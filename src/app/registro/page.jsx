import Derechos from "../components/Derechos"
import '../styles/globals.css';
// import { usuarioFormulario } from "../hook/usuarioFormulario"
import Link from "next/link";

export const metadata = {
    title: "Registro de usuario",
}


function Registro() {

    // const navigate = useNavigate()

    // const {nombre, apellidos, nombre_de_usuario, email, password, onInputChange, onResetForm } = usuarioFormulario ({
    //     nombre: '',
    //     apellidos: '',
    //     nombre_de_usuario: '',
    //     email: '',
    //     password: '',
    // })

    // const onRegistrarUsuario = (e) => {
    //     e.preventDefault()

    //     navigate('/dashboard',{
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
            {/* <form onSubmit={onRegistrarUsuario}> */}
            <div className="EstiloEncabezado">
            <div className="EncabezadoIR">
                        <img src="/images/casaicono.jpeg" alt="Icono_de_la_pagina" className="w-10 h-10 rounded-full" />
                        <span className="ml-3 font-semihold ">Rentas Yamora</span>
                    </div>
                </div>
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">

                    <div className="bg-white rounded-lg p-8 flex flex-col  w-1/3 mx-auto  mt-10 md:mt-0">

                        <h1 className="TituloCuadroRegistro">REGISTRO</h1>

                        {/* <div className="TituloRegistro">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" name="nombre" id="nombre" value={nombre} onChange={onInputChange} required autoComplete="off" placeholder="Nombre" autoFocus className={CuadroRegistro} />
                        </div>

                        <div className="TituloRegistro">
                            <label htmlFor="lastnames">Apellidos</label>
                            <input type="text" name="apellidos" id="apellidos" value={apellidos} onChange={onInputChange} required autoComplete="off" placeholder="Apellidos" className={CuadroRegistro} />
                        </div>

                        <div className="TituloRegistro">
                            <label htmlFor="nombre_de_usuario">Nombre de usuario</label>
                            <input type="text" name="nombre_de_usuario" id="nombre_de_usuario" value={nombre_de_usuario} onChange={onInputChange} required autoComplete="off" placeholder="Nombre de usuario" className={CuadroRegistro} />
                        </div>

                        <div className="TituloRegistro">
                            <label htmlFor="email">Correo electrónico</label>
                            <input type="email" name="email" id="email" value={email} onChange={onInputChange} required autoComplete="off" placeholder="Correo electrónico" className={CuadroRegistro} />
                        </div>

                        <div className="TituloRegistro">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" name="password" id="password" value={password} onChange={onInputChange} required autoComplete="off" placeholder="Contraseña" className={CuadroRegistro} />
                        </div> */}

                        <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Registrar</button>

                        <p className="mt-6">¿Ya estás registrado? <Link href="/sesion">Iniciar sesión</Link></p>
                    </div>
                </div>
                {/* </form> */}
            </section>
            <Derechos />
        </>
    )
}

export default Registro