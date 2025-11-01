// config/db.js
import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('expense-tracker:db');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    log('Reusing MongoDB connection');
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');

  try {
    log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      bufferCommands: false,           // PREVENT BUFFERING
      bufferMaxEntries: 0,
      serverSelectionTimeoutMS: 5000,  // FAIL FAST
      socketTimeoutMS: 10000,
    });

    isConnected = true;
    log('MongoDB connected');
  } catch (err) {
    log('Connection failed:', err.message);
    isConnected = false;
    throw err;
  }
};

export default connectDB;