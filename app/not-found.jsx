import Link from "next/link";
import {FaExclamationTriangle} from 'react-icons/fa'

const NotFoundPage = () => {
    return (  
        <section className="bg-purple-50 min-h-screen flex-grow">
      <div className="container m-auto max-w-2xl py-24">
        <div
          className="bg-white px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0"
        >
          <div className="flex justify-center">
            <FaExclamationTriangle
              className="text-yellow-400 text-8xl fa-5x"
            ></FaExclamationTriangle>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
            <p className="text-gray-500 text-xl mb-10">
              No se encontró.
            </p>
            <Link
              href="/"
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 px-6 rounded"
              >Volver a Home</Link
            >
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
    </section>
    );
}
 
export default NotFoundPage;