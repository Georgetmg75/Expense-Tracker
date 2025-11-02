// server.js
import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import { createHandler } from 'serverless-http';

let handler = null;
let dbPromise = null;

const ensureDB = async () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise(async (resolve, reject) => {
    try {
      const conn = await connectDB();
      console.log('✅ MongoDB connected at startup');
      resolve(conn);
    } catch (err) {
      console.error('❌ DB connection failed:', err.message);
      dbPromise = null;
      reject(err);
    }
  });

  return dbPromise;
};

const handlerFunction = async (event, context) => {
  try {
    await ensureDB();

    if (!handler) {
      handler = createHandler(app);
    }

    return handler(event, context);
  } catch (error) {
    console.error('❌ Server error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export default handlerFunction;