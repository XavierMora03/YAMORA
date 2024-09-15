import { EstiloCuadro, TituloBloques, VerDetalles, SepararCuadros, ImagenCompleta } from "./Variables"
import { Link } from "react-router-dom"

const Bloques = () => {

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          
          <div className={SepararCuadros}>
            <div className={EstiloCuadro}>
              <h1 className={TituloBloques}>Casa de Pepe</h1>
              <p>Casa ubicada en Tal calle, aqui iria la dirección</p>
              <img src="/images/kanao.jpeg" alt="Kanao" className={ImagenCompleta}/>
              <br />
              <Link to="" className={VerDetalles}>Ver más detalles</Link>
            </div>
          </div>
          
          <div className={SepararCuadros}>
            <div className={EstiloCuadro}>
              <h1 className={TituloBloques}>Casa de Masa</h1>
              <p>Casa ubicada en no sé donde </p>
              <img src="/images/elma.jpeg" alt="Kanao" className={ImagenCompleta}/>
              <br />
              <Link to="" className={VerDetalles}>Ver más detalles</Link>
            </div>
          </div>
          
          <div className={SepararCuadros}>
            <div className={EstiloCuadro}>
              <h1 className={TituloBloques}>Casa tres</h1>
              <p>Ubicación</p>
              <img src="/images/frieren.jpeg" alt="Frieren" className={ImagenCompleta}/>
              <br />
              <Link to="" className={VerDetalles}>Ver más detalles</Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
export default Bloques