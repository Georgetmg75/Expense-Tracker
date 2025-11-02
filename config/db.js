import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('❌ MONGO_URI is missing from environment variables');
  }

  try {
    console.log('🔌 Connecting to MongoDB...');

    await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 5,
    });

    console.log('✅ MongoDB Connected. ReadyState:', mongoose.connection.readyState);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;
