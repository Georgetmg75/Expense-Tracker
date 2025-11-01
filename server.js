// server.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import expressApp from './app.js';
import serverless from 'serverless-http';

dotenv.config();

let handler = null;

// Single connection reuse across Vercel invocations
let dbPromise = null;

export default async function (req, res) {
  try {
    // Connect to DB once per cold start
    if (!dbPromise) {
      dbPromise = connectDB().then(() => {
        console.log('MongoDB connected successfully');
      }).catch(err => {
        console.error('Failed to connect to MongoDB:', err.message);
        dbPromise = null; // Allow retry on next invocation
        throw err;
      });
    }

    // Wait for DB connection
    await dbPromise;

    // Create handler once
    if (!handler) {
      handler = serverless(expressApp);
    }

    // Forward request
    return handler(req, res);

  } catch (err) {
    console.error('Unhandled server error:', err);
    if (!res.headersSent) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
}