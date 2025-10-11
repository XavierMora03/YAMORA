
'use server';
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";


async function checkBookmarkStatus(propertyId) {
        await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId){
        throw new Error('Se necesita un ID de usuario')
    }

    const userId = sessionUser.userId;

    const user = await User.findById(userId);

    let isBookmarked = user.bookmarks.includes(propertyId);

    return {isBookmarked};
}

export default checkBookmarkStatus;