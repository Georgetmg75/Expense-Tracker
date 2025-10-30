import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import app from '../app.js';

dotenv.config();

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB(); // Connect to MongoDB using MONGO_URI
      isConnected = true;
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      return res.status(500).json({ message: 'Database connection error' });
    }
  }

  try {
    return app(req, res); // Pass request to Express app
  } catch (err) {
    console.error('❌ Express app error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}










// import dotenv from 'dotenv';
// import connectDB from '../config/db.js';
// import app from '../app.js';

// dotenv.config();

// let isConnected = false;

// export default async function handler(req, res) {
//   if (!isConnected) {
//     try {
//       await connectDB();
//       isConnected = true;
//       console.log('✅ MongoDB connected');
//     } catch (err) {
//       console.error('❌ MongoDB connection failed:', err.message);
//       return res.status(500).json({ message: 'Database connection error' });
//     }
//   }

//   return app(req, res);
// }
