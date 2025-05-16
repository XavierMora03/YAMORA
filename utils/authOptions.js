import GoogleProvider from 'next-auth/providers/google';

export const authOptions ={
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    ],
    callbacks: {
        //Invoked on successful sign in
        async singIn({profile}) {
            // 1. Connect to database
            // 2. Check if user exists
            // 3. If not, create user
            // 4. Return true to allow sign in
        },
        // Session callback function that modifies the session object
        async session({session}){
            // 1. Get user from database
            // 2. Assomg user id from the session
            // 3. Return session
        }
    }
};