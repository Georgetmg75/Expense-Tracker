// server.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import expressApp from './app.js';
import serverless from 'serverless-http';

dotenv.config();

let isConnected = false;
let handler;

export default async function(req, res) {
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

  if (!handler) {
    handler = serverless(expressApp);
  }

  return handler(req, res);
}
