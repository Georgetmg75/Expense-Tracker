// db.js
import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('expense-tracker:db');

let isConnected = false;

/**
 * Connects to MongoDB using MONGO_URI.
 * Optimized for Vercel serverless (no buffering, fast timeout).
 */
const connectDB = async () => {
  // Reuse connection in serverless warm starts
  if (isConnected) {
    log('Reusing existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    log('MONGO_URI not defined in environment variables');
    throw new Error('Please define MONGO_URI in your .env or Vercel env vars');
  }

  try {
    log('Connecting to MongoDB...');

    const conn = await mongoose.connect(uri, {
      // Critical for Vercel: Prevent buffering timeouts
      bufferCommands: false,
      bufferMaxEntries: 0,

      // Faster timeout (Vercel has ~10s limit per function)
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,

      // Optional: improve reliability
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    isConnected = true;
    log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    log(`MongoDB connection failed: ${err.message}`);
    isConnected = false; // Reset on failure
    throw err; // Let caller handle
  }
};

// Optional: Graceful shutdown (helps in dev)
process.on('SIGINT', async () => {
  if (isConnected) {
    await mongoose.connection.close();
    log('MongoDB disconnected on app termination');
    process.exit(0);
  }
});

export default connectDB;