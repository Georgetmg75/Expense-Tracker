// server.js
import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import { createHandler } from 'serverless-http';

// CONNECT DB **FIRST**
await connectDB();
console.log('🚀 MONGODB CONNECTED AT STARTUP');

// HANDLER
let handler = null;
const handlerFunction = async (event, context) => {
  if (!handler) {
    handler = createHandler(app);
    console.log('🔥 HANDLER READY');
  }
  return handler(event, context);
};

export default handlerFunction;