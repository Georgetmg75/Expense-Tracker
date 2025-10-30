import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import app from '../app.js';

dotenv.config(); // ✅ Loads .env variables

// ✅ Await MongoDB connection before starting server
await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
