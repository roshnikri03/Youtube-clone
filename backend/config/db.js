import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://roshnikumari90403_db_user:P3slRESfBDmcFeNP@cluster0.l4psoig.mongodb.net/?appName=Cluster0');
    // // Keep the connection string outside the source when deploying or sharing the repository.
    // const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/youtube-clone';
    // const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

