// routes/dashboardRoutes.js
import express from 'express';
import Dashboard from '../models/dashboardModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('GET DASHBOARD FOR:', userId);

    const dashboard = await Dashboard.findOne({ userId }).lean();

    if (!dashboard) {
      return res.json({ totalSalary: 0, budgetTables: {} });
    }

    const plainBudget = Object.fromEntries(
      Array.from(dashboard.budgetTables.entries()).map(([k, v]) => [k, v])
    );

    res.json({
      totalSalary: dashboard.totalSalary || 0,
      budgetTables: plainBudget
    });
  } catch (err) {
    console.error('GET ERROR:', err.message);
    res.status(500).json({ message: 'Failed to load' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { totalSalary, budgetTables: incoming } = req.body;
  const userId = req.user._id;

  try {
    console.log('SAVE DASHBOARD FOR:', userId);

    const normalized = new Map();
    for (const [cat, data] of Object.entries(incoming || {})) {
      normalized.set(cat, {
        budget: Number(data.budget) || 0,
        expenses: (data.expenses || []).map(e => ({
          ...e,
          amount: Number(e.amount) || 0
        }))
      });
    }

    const updated = await Dashboard.findOneAndUpdate(
      { userId },
      { totalSalary: Number(totalSalary) || 0, budgetTables: normalized },
      { upsert: true, new: true }
    ).lean();

    res.json({ message: 'Saved!', totalSalary: updated.totalSalary });
  } catch (err) {
    console.error('SAVE ERROR:', err.message);
    res.status(500).json({ message: 'Save failed' });
  }
});

export default router;