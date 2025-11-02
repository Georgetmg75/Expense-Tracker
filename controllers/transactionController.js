// controllers/transactionController.js
import Transaction from '../models/transactionModel.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const fetchTransactions = asyncHandler(async (req, res) => {
  const filters = { userId: req.user.id, ...req.query };
  const transactions = await Transaction.find(filters).sort({ date: -1 });
  res.json(transactions);
});

export const addTransaction = async (req, res, next) => {
  const newTx = new Transaction({ ...req.body, userId: req.user.id });
  await newTx.save();
  res.status(201).json(newTx);
};

export const editTransaction = async (req, res, next) => {
  const { id } = req.params;
  const updatedTx = await Transaction.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );
  res.json(updatedTx);
};

export const removeTransaction = async (req, res, next) => {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  res.status(204).end();
};