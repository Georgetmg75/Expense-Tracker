import express from 'express';
import Transaction from '../models/transactionModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, userId: req.userId });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add transaction' });
  }
});

export default router;
