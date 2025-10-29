import express from 'express';
import Expense from '../models/Expense.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.userId });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add expense' });
  }
});

export default router;