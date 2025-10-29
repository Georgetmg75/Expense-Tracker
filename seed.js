// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Transaction from './models/transactionModel.js';

dotenv.config();

try {
  await connectDB(); // ✅ Reuse-safe connection

  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_pw', // 🔐 Replace with hashed password if needed
  });

  const transactions = [
    { userId: user._id, amount: 100, category: 'Food', note: 'Lunch', date: new Date() },
    { userId: user._id, amount: 200, category: 'Transport', note: 'Cab', date: new Date() },
  ];

  await Transaction.insertMany(transactions);

  console.log('✅ Seeded successfully');
  process.exit(0);
} catch (err) {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
}
