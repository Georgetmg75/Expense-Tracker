// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Transaction from './models/transactionModel.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const user = await User.create({ name: 'Test User', email: 'test@example.com', password: 'hashed_pw' });

const transactions = [
  { userId: user._id, amount: 100, category: 'Food', note: 'Lunch', date: new Date() },
  { userId: user._id, amount: 200, category: 'Transport', note: 'Cab', date: new Date() },
];

await Transaction.insertMany(transactions);
console.log('✅ Seeded successfully');
process.exit();
