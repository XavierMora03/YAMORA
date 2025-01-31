import InfoBox from "./InfoBox";

const InfoBoxes = () => {
    return  (<section>
        <div className="container-xl lg:container m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
            <InfoBox heading ='Para inquilinos' buttonInfo={{
                text:'Consultar propiedades',
                link: '/properties',
                backgroundColor: 'bg-black'
            }}>Encuentra tu proximo hogar...</InfoBox>
            <InfoBox heading='Para propietarios' backgroundColor='bg-purple-100' buttonInfo={{
                text:'Añadir propiedad',
                link: '/properties/add',
                backgroundColor: 'bg-purple-500'
            }}>
            Guarda tus propiedades y conecta con posibles inquilinos</InfoBox>
            
          </div>
        </div>
      </section>);
}
 
export default InfoBoxes;