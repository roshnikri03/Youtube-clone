import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Below is the commented connection string for MongoDB Atlas. It uses the MONGODB_URI environment variable for security.
    // const conn = await mongoose.connect('mongodb+srv://roshnikumari90403_db_user:P3slRESfBDmcFeNP@cluster0.l4psoig.mongodb.net/?appName=Cluster0');
    // Keep the connection string outside the source when deploying or sharing the repository.
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

