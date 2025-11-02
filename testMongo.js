// testMongo.js
import mongoose from 'mongoose';
import 'dotenv/config';

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ MONGO_URI is missing');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
