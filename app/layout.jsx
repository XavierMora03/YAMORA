import Navbar from '@/components/Navbar';
import '@/assets/styles/globals.css';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
    title: 'Rentas YAMORA',
    keywords: 'rental, property, real-state',
    description: 'Encuentra tu casona'
}

const MainLayout = ({children}) => {
    return (
        <AuthProvider>
            <html>
                <body>
                <Navbar/>
                <main>{children}</main> 
                <Footer/>
                <ToastContainer/>
                </body>
            </html>
        </AuthProvider>
    );
};

export default MainLayout;