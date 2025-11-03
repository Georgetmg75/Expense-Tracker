// routes/dashboardRoutes.js
import express from 'express';
import Dashboard from '../models/dashboardModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET dashboard
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; // FROM JWT
    console.log('GET DASHBOARD FOR userId:', userId);

    const dashboard = await Dashboard.findOne({ userId });

    if (!dashboard) {
      return res.json({ totalSalary: 0, budgetTables: {} });
    }

    // CONVERT MAP TO PLAIN OBJECT
    const plainBudget = Object.fromEntries(
      Array.from(dashboard.budgetTables.entries()).map(([key, value]) => [
        key,
        {
          budget: value.budget || 0,
          expenses: Array.isArray(value.expenses) ? value.expenses : []
        }
      ])
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

// POST / UPDATE dashboard
router.post('/', verifyToken, async (req, res) => {
  const { totalSalary, budgetTables: incomingBudget } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log('SAVING DASHBOARD FOR userId:', userId);

    // NORMALIZE TO MAP
    const normalizedBudget = new Map();
    for (const [category, data] of Object.entries(incomingBudget || {})) {
      normalizedBudget.set(category, {
        budget: Number(data.budget) || 0,
        expenses: Array.isArray(data.expenses) ? data.expenses.map(e => ({
          ...e,
          amount: Number(e.amount) || 0
        })) : []
      });
    }

    // UPSERT
    const updated = await Dashboard.findOneAndUpdate(
      { userId },
      { 
        totalSalary: Number(totalSalary) || 0,
        budgetTables: normalizedBudget
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      message: 'Dashboard saved!',
      dashboard: {
        totalSalary: updated.totalSalary,
        budgetTables: Object.fromEntries(
          Array.from(updated.budgetTables.entries()).map(([k, v]) => [k, v])
        )
      }
    });
  } catch (err) {
    console.error('SAVE ERROR:', err.message);
    res.status(500).json({ message: 'Save failed' });
  }
});

export default router;