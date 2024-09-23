import { EstiloElementosLaterales } from "../components/Variables"
import '../globals.css';
import Derechos from "../components/Derechos"
import ImageMenu from "../components/ImageMenu";
import Link from "next/link";
function Dashboard() {
    return (
        <>
            <div className="flex h-screen bg-gray-100">
                <div className="w-64 bg-purple-400 text-white flex flex-col">
                    <div className="p-6 text-lg font-semibold flex title-font">
                        <Link href="/">
                            <img src="/images/casaicono.jpeg" alt="Icono_de_la_pagina" className="w-10 h-10 rounded-full" />
                        </Link>
                        <Link href="/">
                            <span className="ml-3 font-semihold ">Rentas Yamora</span>
                        </Link>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <a className="EstiloElementosLaterales">Inicio</a>
                        <a className="EstiloElementosLaterales">Mis rentas</a>
                        <a className="EstiloElementosLaterales">Guardados</a>
                    </nav>
                </div>

                <div className="flex-1 flex flex-col">
                    <header className="bg-white shadow-md p-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold">Dashboard</h1>
                            <div><ImageMenu /></div>
                        </div>
                    </header>

                    <section className="flex-1 p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-white shadow-md rounded p-4">
                                <h2 className="text-lg font-semibold">Statistics 1</h2>
                                <p className="text-gray-600">Details about stat 1...</p>
                            </div>
                            <div className="bg-white shadow-md rounded p-4">
                                <h2 className="text-lg font-semibold">Statistics 2</h2>
                                <p className="text-gray-600">Details about stat 2...</p>
                            </div>
                            <div className="bg-white shadow-md rounded p-4">
                                <h2 className="text-lg font-semibold">Statistics 3</h2>
                                <p className="text-gray-600">Details about stat 3...</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Derechos />
        </>
    )
}

export default Dashboard