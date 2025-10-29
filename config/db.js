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
    log('❌ MONGO_URI not defined in environment');
    throw new Error('Missing MONGO_URI in environment');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    log(`❌ MongoDB connection error: ${err.message}`);
    throw err; // Let Vercel handle the crash gracefully
  }
};

export default connectDB;
