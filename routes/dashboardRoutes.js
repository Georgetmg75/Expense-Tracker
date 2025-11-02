import express from 'express';
import Dashboard from '../models/dashboardModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ GET dashboard data
router.get('/', verifyToken, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ userId: req.userId });

    if (!dashboard) {
      return res.json({ totalSalary: 0, budgetTables: {} });
    }

    // Convert Map to plain object for frontend
    const plainBudget = {};
    for (const [key, value] of dashboard.budgetTables.entries()) {
      plainBudget[key] = {
        budget: value.budget || 0,
        expenses: Array.isArray(value.expenses) ? value.expenses : []
      };
    }

    res.json({
      totalSalary: dashboard.totalSalary || 0,
      budgetTables: plainBudget
    });
  } catch (err) {
    console.error('Dashboard GET error:', err.message);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
});

// ✅ POST or update dashboard data
router.post('/', verifyToken, async (req, res) => {
  const { totalSalary, budgetTables } = req.body;

  try {
    // Normalize incoming budgetTables to Map-compatible format
    const normalizedBudget = new Map();
    for (const category in budgetTables) {
      const entry = budgetTables[category];
      normalizedBudget.set(category, {
        budget: entry.budget || 0,
        expenses: Array.isArray(entry.expenses) ? entry.expenses : []
      });
    }

    const existing = await Dashboard.findOne({ userId: req.userId });

    if (existing) {
      existing.totalSalary = totalSalary;
      existing.budgetTables = normalizedBudget;
      await existing.save();
      res.json({ message: 'Dashboard updated successfully' });
    } else {
      const newDashboard = new Dashboard({
        userId: req.userId,
        totalSalary,
        budgetTables: normalizedBudget
      });
      await newDashboard.save();
      res.status(201).json({ message: 'Dashboard created successfully' });
    }
  } catch (err) {
    console.error('Dashboard POST error:', err.message);
    res.status(400).json({ message: 'Failed to save dashboard' });
  }
});

export default router;