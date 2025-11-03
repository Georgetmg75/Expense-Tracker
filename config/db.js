import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI is missing from environment variables');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔌 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 5,
    });
  }

  cached.conn = await cached.promise;

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected via event');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error via event:', err);
  });

  return cached.conn;
};

export default connectDB;