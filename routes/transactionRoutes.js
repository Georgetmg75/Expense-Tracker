// routes/transactionRoutes.js
import express from 'express';
import Transaction from '../models/transactionModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('FETCH TRANSACTIONS FOR:', userId);

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .lean(); // FASTER

    res.json(transactions);
  } catch (err) {
    console.error('TRANSACTIONS ERROR:', err.message);
    res.status(500).json({ message: 'Failed to load transactions' });
  }
});

// ✅ POST: Add new transaction for authenticated user
router.post('/', async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, userId: req.userId });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Transaction save error:', err.message);
    res.status(400).json({ message: 'Failed to add transaction' });
  }
});

export default router;