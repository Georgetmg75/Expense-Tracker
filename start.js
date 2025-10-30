// 🚀 Local development entry point — not used by Vercel

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config(); // ✅ Load environment variables

try {
  await connectDB();
  console.log('✅ MongoDB connected');
} catch (err) {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1); // Exit if DB connection fails
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running locally on port ${PORT}`);
});
