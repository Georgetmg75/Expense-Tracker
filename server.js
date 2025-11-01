// server.js
import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import { createHandler } from 'serverless-http';

// SINGLE handler + DB promise
let handler = null;
let dbPromise = null;

const ensureDB = async () => {
  if (dbPromise) return dbPromise;

  dbPromise = connectDB()
    .then(() => {
      console.log('MongoDB connected at startup');
    })
    .catch(err => {
      console.error('DB connection failed:', err.message);
      dbPromise = null;
      throw err;
    });

  return dbPromise;
};

// EXPORT THE HANDLER FUNCTIONs
const handlerFunction = async (event, context) => {
  try {
    await ensureDB();

    if (!handler) {
      handler = createHandler(app);
    }

    return handler(event, context);
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Export for Vercel
export default handlerFunction;