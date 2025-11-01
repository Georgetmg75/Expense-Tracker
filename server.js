// server.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import expressApp from './app.js';
import serverless from 'serverless-http';

dotenv.config();

// CONNECT TO DB ONCE — BEFORE ANY REQUEST
let dbConnectionPromise = null;
let handler = null;

const ensureDBConnection = async () => {
  if (dbConnectionPromise) return dbConnectionPromise;

  dbConnectionPromise = connectDB()
    .then(() => {
      console.log('MongoDB connected (cold start)');
    })
    .catch(err => {
      console.error('DB connection failed:', err.message);
      dbConnectionPromise = null;
      throw err;
    });

  return dbConnectionPromise;
};

// Export handler
export default async function (req, res) {
  try {
    // Wait for DB before handling request
    await ensureDBConnection();

    // Create handler once
    if (!handler) {
      handler = serverless(expressApp);
    }

    return handler(req, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Database unavailable' });
    }
  }
}