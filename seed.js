// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Transaction from './models/transactionModel.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing data...');
    await User.deleteMany();
    await Transaction.deleteMany();

    console.log('👤 Creating test user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });

    console.log('💸 Seeding transactions...');
    const transactions = [
      { userId: user._id, amount: 100, category: 'Food', note: 'Lunch', date: new Date() },
      { userId: user._id, amount: 200, category: 'Transport', note: 'Cab', date: new Date() },
    ];

    await Transaction.insertMany(transactions);

    console.log('✅ Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedData();
