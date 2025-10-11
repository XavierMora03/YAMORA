import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database";
import User from "@/models/User";
import '@/models/Property';
import { getSessionUser } from "@/utils/getSessionUser";

const SavedPropertiesPage = async() => {
    await connectDB();
    
    const sessionUser = await getSessionUser();
    
    if (!sessionUser || !sessionUser.userId) {
        throw new Error('Se necesita un ID de usuario');
    }
    
    const userId = sessionUser.userId;
    
    const {bookmarks} = await User.findById(userId).populate('bookmarks');

    return (
        <section className="px-4 py-6">
            <div className="container lg:container m-auto px-4 py-6">
                <h1 className="text-2xl mb-4">Propiedades Guardadas</h1>
                {bookmarks.length === 0 ? (
                    <p>Sin propiedades guardadas</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {bookmarks.map((property)=>(
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
 
export default SavedPropertiesPage;