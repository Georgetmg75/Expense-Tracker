// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }

  try {
    console.log('🔌 Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 5,
    });

    console.log('✅ MongoDB Connected - Ready State:', mongoose.connection.readyState);
  } catch (error) {
    console.error('❌ DB Connection Error:', error.message);
    throw error;
  }
};

export { connectDB, mongoose };  // Export mongoose for readyState check