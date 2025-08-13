import connectDB from "@/config/database"
import Property from "@/models/Property"
import { convertToSerializableObject } from "@/utils/convertToObject";


const SearchResultsPage = async ({searchParams: {location, propertyType}}) => {
    console.log(location,propertyType);
    await connectDB();
    const locationPattern = new RegExp(location,'i');
    let query = {
        $or: [
            {name: locationPattern},
            {description: locationPattern},
            {'location.street': locationPattern},
            {'location.city': locationPattern},
            {'location.state': locationPattern},
            {'location.zipcode': locationPattern},
        ]
    }

    if (propertyType && propertyType !== 'All'){
        const typePattern = new RegExp(propertyType, 'i');
        query.type = typePattern;
    }

    const propertiesQueryResults = await Property.find(query).lean();
    const properties = convertToSerializableObject(propertiesQueryResults);
    console.log(properties);

    return ( <div>Search Results</div> );
}
 
export default SearchResultsPage;