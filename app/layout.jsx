import Navbar from '@/components/Navbar';
import '@/assets/styles/globals.css';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';

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
                </body>
            </html>
        </AuthProvider>
    );
};

export default MainLayout;