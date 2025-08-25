import connectDB from "@/config/database";
import Property from "@/models/Property";


const FeaturedProperties = async () => {
    await connectDB();

    const properties = await Property.find({
        is_featured: true,
    }).lean();
    return properties.length > 0 ? (
        <section className="bg-blue px-4 pt-6 pb-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-purple-500 mb-6">
                    Propiedades destacadas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.map((property)=> (
                    <h3>{property.name}</h3>    
                ))}
                </div>
            </div>

        </section>
    ) : null;
}
 
export default FeaturedProperties;