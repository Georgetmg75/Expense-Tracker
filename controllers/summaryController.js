// controllers/summaryController.js
import Transaction from '../models/transactionModel.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getMonthlySummary = async (req, res) => {
  const summary = await Transaction.aggregate([
    { $match: { userId: req.user.id } },
    {
      $group: {
        _id: { $month: '$date' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id': 1 } },
  ]);
  res.json(summary);
};

export const getCategorySummary = async (req, res) => {
  const summary = await Transaction.aggregate([
    { $match: { userId: req.user.id } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);
  res.json(summary);
};

export const fetchTransactions = asyncHandler(async (req, res) => {
  const filters = { userId: req.user.id, ...req.query };
  const transactions = await Transaction.find(filters).sort({ date: -1 });
  res.json(transactions);
});