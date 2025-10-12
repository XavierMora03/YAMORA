import connectDB from '@/config/database';
import User from '@/models/User';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        await connectDB();
        const userExists = await User.findOne({ email: profile.email });
        
        if (!userExists) {
          const username = profile.name.slice(0, 20);
          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    
    async session({ session, token }) {
      // Use the MongoDB user ID from the token
      if (token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },

    async jwt({ token, user, profile }) {
      // When user first signs in, fetch the MongoDB user ID
      if (profile && profile.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: profile.email });
          if (dbUser) {
            token.userId = dbUser._id.toString();
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      return token;
    },
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every 24 hours
  },
};
