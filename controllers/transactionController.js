import Transaction from '../models/transactionModel.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// ✅ GET: Fetch transactions for authenticated user
export const fetchTransactions = asyncHandler(async (req, res) => {
  const filters = { userId: req.user._id, ...req.query };
  const transactions = await Transaction.find(filters).sort({ date: -1 });
  res.json(transactions);
});

// ✅ POST: Add new transaction
export const addTransaction = asyncHandler(async (req, res) => {
  const newTx = new Transaction({ ...req.body, userId: req.user._id });
  await newTx.save();
  res.status(201).json(newTx);
});

// ✅ PUT: Edit transaction
export const editTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedTx = await Transaction.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );
  res.json(updatedTx);
});

// ✅ DELETE: Remove transaction
export const removeTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  res.status(204).end();
});
