// server.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import expressApp from './app.js';
import serverless from 'serverless-http';

dotenv.config();

// CRITICAL: CONNECT ONCE AT COLD START
let connectionPromise = null;
let handler = null;

const ensureConnection = async () => {
  if (connectionPromise) return connectionPromise;

  connectionPromise = connectDB()
    .then(() => {
      console.log('MongoDB connected at server start');
    })
    .catch(err => {
      console.error('DB connection failed:', err.message);
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

// EXPORT HANDLER
export default async function (req, res) {
  try {
    // ENSURE DB IS CONNECTED BEFORE ROUTE RUNS
    await ensureConnection();

    if (!handler) {
      handler = serverless(expressApp);
    }

    return handler(req, res);
  } catch (err) {
    console.error('Server startup error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Service unavailable' });
    }
  }
}