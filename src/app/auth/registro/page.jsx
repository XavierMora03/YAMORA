"use client"

import Derechos from "../../components/Derechos"
import '../../globals.css';
// import { usuarioFormulario } from "../hook/usuarioFormulario"
import { useForm } from "react-hook-form";
import Link from "next/link";

// export const metadata = {
//     title: "Registro de usuario",
// }


function Registro() {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = handleSubmit(async (data) => {

        // if (data.contrasena !== data.confirmar_contrasena){
        //     return alert("Las contraseñas no coinciden")
        // }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(
                {
                    nombre: data.nombre,
                    apellidos: data.apellidos,
                    fecha_nacimiento: data.fecha_nacimiento,
                    genero: data.genero,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    nombre_usuario: data.nombre_usuario,
                    correo: data.correo,
                    contrasena: data.contrasena

                }
        ),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const resJSON = await res.json()
        console.log(resJSON)
    })

    

    return (
        <>
            <section className="text-black body-font">
                <form onSubmit={onSubmit}>
                    <div className="EstiloEncabezado">
                        <div className="EncabezadoIR">
                            <img src="/images/casaicono.jpeg" alt="Icono_de_la_pagina" className="w-10 h-10 rounded-full" />
                            <span className="ml-3 font-semihold ">Rentas Yamora</span>
                        </div>
                    </div>
                    <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">

                        <div className="bg-white rounded-lg p-8 flex flex-col  w-1/3 mx-auto  mt-10 md:mt-0">

                            <h1 className="TituloCuadroRegistro">REGISTRO 👤</h1>

                            <div className="TituloRegistro">
                                <label htmlFor="nombre">Nombre</label>
                                <input type="text" name="nombre" id="nombre" autoComplete="off" placeholder="Nombre" autoFocus className="CuadroRegistro" {...(register("nombre", {required: {
                                    value: true,
                                    message: "El nombre es requerido"
                                }}))}/>
                                {
                                    errors.nombre && (
                                        <span className="MensajeRequerido">
                                        {errors.nombre.message}
                                        </span>
                                    )
                                }
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="apellidos">Apellidos</label>
                                <input type="text" name="apellidos" id="apellidos" autoComplete="off" placeholder="Apellidos" className="CuadroRegistro" {...(register("apellidos", {required: {
                                    value: true,
                                    message: "Los apellidos son requeridos"
                                }}))}/>
                                {
                                    errors.apellidos && (
                                        <span className="MensajeRequerido">
                                        {errors.apellidos.message}
                                        </span>
                                    )
                                }
                            </div>


                            <div className="TituloRegistro">
                                <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                                <input type="date" name="fecha_nacimiento" id="fecha_nacimiento"  autoComplete="off" placeholder="Fecha de nacimiento" className="CuadroRegistro" {...(register("fecha_nacimiento", {required: {
                                    value: true,
                                    message: "La fecha de nacimiento es requerida"
                                }}))}/>
                                 {
                                    errors.fecha_nacimiento && (
                                        <span className="MensajeRequerido">
                                        {errors.fecha_nacimiento.message}
                                        </span>
                                    )
                                }
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="genero">Género:</label>
                                <select id="genero" name="genero" className="CuadroRegistro" {...(register("genero", {required: {
                                    value: true,
                                    message: "El genero es requerido"
                                }}))}>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                    <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
                                </select>
                                {/* {
                                    errors.genero && (
                                        <span className="MensajeRequerido">
                                        {errors.genero.message}
                                        </span>
                                    )
                                } */}
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="telefono">Teléfono</label>
                                <input type="text" name="telefono" id="telefono"  autoComplete="off" placeholder="Telefono" className="CuadroRegistro" {...(register("telefono", {required: {
                                    value: true,
                                    message: "El telefono es requerido"
                                }}))}/>
                                 {
                                    errors.telefono && (
                                        <span className="MensajeRequerido">
                                        {errors.telefono.message}
                                        </span>
                                    )
                                }
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="direccion">Dirección</label>
                                <input type="text" name="direccion" id="direccion"  autoComplete="off" placeholder="Dirección" className="CuadroRegistro" {...(register("direccion", {required: {
                                    value: true,
                                    message: "La direccion es requerida"
                                }}))}/>
                                 {
                                    errors.direccion && (
                                        <span className="MensajeRequerido">
                                        {errors.direccion.message}
                                        </span>
                                    )
                                }
                            </div>

                            {/* <div className="TituloRegistro">
                                <label htmlFor="foto_perfil">Foto de perfil</label>
                                <input type="file" name="foto_perfil" id="foto_perfil" autoComplete="off" placeholder="Foto_perfil" className="CuadroRegistro" {...(register("foto_perfil", {required: {
                                    value: true,
                                    message: "La foto es requerida"
                                }}))}/>
                                 {
                                    errors.foto_perfil && (
                                        <span className="MensajeRequerido">
                                        {errors.foto_perfil.message}
                                        </span>
                                    )
                                }
                            </div> */}

                            <div className="TituloRegistro">
                                <label htmlFor="nombre_usuario">Nombre de usuario</label>
                                <input type="text" name="nombre_usuario" id="nombre_usuario"  autoComplete="off" placeholder="Nombre de usuario" className="CuadroRegistro" {...(register("nombre_usuario", {required: {
                                    value: true,
                                    message: "El nombre de usuario es requerido"
                                }}))}/>
                                 {
                                    errors.nombre_usuario && (
                                        <span className="MensajeRequerido">
                                        {errors.nombre_usuario.message}
                                        </span>
                                    )
                                }
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="correo">Correo electrónico</label>
                                <input type="email" name="correo" id="correo"  autoComplete="off" placeholder="Correo electrónico" className="CuadroRegistro" {...(register("correo", {required: {
                                    value: true,
                                    message: "El correo electronico es requerido"
                                }}))}/>
                                 {
                                    errors.correo && (
                                        <span className="MensajeRequerido">
                                        {errors.correo.message}
                                        </span>
                                    )
                                }
                            </div>

                            <div className="TituloRegistro">
                                <label htmlFor="contrasena">Contraseña</label>
                                <input type="password" name="contrasena" id="contrasena"  autoComplete="off" placeholder="Contraseña" className="CuadroRegistro" {...(register("contrasena", {required: {
                                    value: true,
                                    message: "La contraseña es requerida"
                                }}))}/>
                                 {
                                    errors.contrasena && (
                                        <span className="MensajeRequerido">
                                        {errors.contrasena.message}
                                        </span>
                                    )
                                }
                            </div>

                            {/* <div className="TituloRegistro">
                                <label htmlFor="confirmar_contrasena">Contraseña</label>
                                <input type="confirmar_password" name="confirmar_contrasena" id="confirmar_contrasena"  autoComplete="off" placeholder="Confirmar Contraseña" className="CuadroRegistro" {...(register("confirmar_contrasena", {required: {
                                    value: true,
                                    message: "La confirmación de contraseña es requerida"
                                }}))}/>
                                 {
                                    errors.confirmar_contrasena && (
                                        <span className="MensajeRequerido">
                                        {errors.confirmar_contrasena.message}
                                        </span>
                                    )
                                }
                            </div> */}

                            <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Registrar</button>

                            <p className="mt-6">¿Ya estás registrado? <Link href="/auth/sesion">Iniciar sesión</Link></p>
                        </div>
                    </div>
                </form>
            </section>
            <Derechos />
        </>
    )
}

export default Registro