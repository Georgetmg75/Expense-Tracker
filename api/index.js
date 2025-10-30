import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import app from '../app.js';

dotenv.config();

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      return res.status(500).json({ message: 'Database connection error' });
    }
  }

  return app(req, res);
}
