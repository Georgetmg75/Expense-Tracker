import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('expense-tracker:db');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    log('🔁 Reusing existing MongoDB connection');
    return;
  }

  if (!process.env.MONGO_URI) {
    log('❌ MONGO_URI not defined');
    throw new Error('Missing MONGO_URI');
  }

  try {
    log('🔌 Attempting MongoDB connection...');
    const conn = await mongoose.connect(process.env.MONGO_URI); // ✅ Cleaned: no deprecated options

    isConnected = true;
    log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    log(`❌ MongoDB connection error: ${err.message}`);
    throw err;
  }
};

export default connectDB;
