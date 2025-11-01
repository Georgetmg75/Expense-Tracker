// config/db.js
import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment');
  }

  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });

    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    isConnected = false;
    throw error;
  }
};

export default connectDB;