"use client";

import '../globals.css';
import { EstiloCuadro, TituloBloques, VerDetalles, SepararCuadros, ImagenCompleta } from "./Variables"

function Bloques() {

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto md:auto">
                <div className="flex flex-wrap -m-4">

                    <div className="SepararCuadros">
                        <div className="EstiloCuadro">
                            <h1 className="TituloBloques">Casa de Pepe</h1>
                            <p>Casa ubicada en Tal calle, aqui iria la dirección</p><br/>
                            <img src="/images/kanao.jpeg" alt="Kanao" className="ImagenCompleta" />
                            <br />
                            <a className="VerDetalles">Ver más detalles</a>
                        </div>
                    </div>

                    <div className="SepararCuadros">
                        <div className="EstiloCuadro">
                            <h1 className="TituloBloques">Casa de Masa</h1>
                            <p>Casa ubicada en no sé donde </p><br/>
                            <img src="/images/elma.jpeg" alt="Kanao" className="ImagenCompleta" />
                            <br />
                            <a className="VerDetalles">Ver más detalles</a>
                        </div>
                    </div>

                    <div className="SepararCuadros">
                        <div className="EstiloCuadro">
                            <h1 className="TituloBloques">Casa tres</h1>
                            <p>Ubicación</p><br/>
                            <img src="/images/frieren.jpeg" alt="Frieren" className="ImagenCompleta" />
                            <br />
                            <a className="VerDetalles">Ver más detalles</a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
export default Bloques