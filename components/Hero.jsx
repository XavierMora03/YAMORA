import PropertySearchForm from './PropertySearchForm.jsx'
const Hero = () => {
    return (<section className="bg-purple-700 py-20 mb-4">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
        >
          <div className="text-center">
            <h1
              className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl"
            >
              Rentas YAMORA
            </h1>
            <p className="my-4 text-xl text-white">
              Encuentra la propiedad adecuada para tí.
            </p>
          </div>
          {/*<!-- Form Component -->*/}
        <PropertySearchForm/>
          
        </div>
      </section>
  );
}
 
export default Hero ;
