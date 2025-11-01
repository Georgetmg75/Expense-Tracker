import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('expense-tracker:db');

let isConnected = false;

/**
 * Connects to MongoDB using MONGO_URI from environment variables.
 * Reuses connection if already established.
 */
const connectDB = async () => {
  if (isConnected) {
    log('🔁 Reusing existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    log('❌ MONGO_URI not defined');
    throw new Error('Missing MONGO_URI in environment variables');
  }

  try {
    log('🔌 Attempting MongoDB connection...');
    const conn = await mongoose.connect(uri);

    isConnected = true;
    log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    log(`❌ MongoDB connection error: ${err.message}`);
    throw err;
  }
};

export default connectDB;
