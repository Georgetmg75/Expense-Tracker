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
      bufferCommands: false,        // ← DISABLE BUFFERING (fixes timeout)
      bufferMaxEntries: 0,          // ← No queue
      serverSelectionTimeoutMS: 5000,  // ← Fail fast (5s)
      socketTimeoutMS: 45000,       // ← Vercel function limit
      family: 4,                    // ← IPv4 only (faster)
      maxPoolSize: 5,               // ← Small pool for serverless
    });

    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ DB Connection Error:', error.message);
    throw error;
  }
};

export default connectDB;