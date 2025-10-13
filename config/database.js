import mongoose from "mongoose";

   let connected = false;

   const connectDB = async () => {
     mongoose.set('strictQuery', true);

     if (connected) {
       console.log('MongoDB is already connected');
       return;
     }

     try {
       await mongoose.connect(process.env.MONGODB_URI, {
         serverSelectionTimeoutMS: 5000,
         socketTimeoutMS: 45000,
         connectTimeoutMS: 10000,
       });
       connected = true;
       console.log('MongoDB connected');
     } catch (error) {
       console.error('MongoDB connection error:', error);
       throw error;
     }
   };

   export default connectDB;
