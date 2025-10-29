// src/routes/transactionRoutes.js
import express from 'express';
import Transaction from '../models/transactionModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Apply middleware to all routes below
router.use(verifyToken);

// ✅ GET: Fetch transactions for authenticated user
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    res.json(transactions);
  } catch (err) {
    console.error('Transaction fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch transactions' });
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
