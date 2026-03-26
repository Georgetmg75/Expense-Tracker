// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoose from 'mongoose';

import transactionRoutes from './routes/transactionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import expenseRoutes from './routes/expenses.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// ✅ Trust proxy (for rate limiting + Vercel compatibility)
app.set('trust proxy', 1);

// ✅ CORS setup
app.use(cors({
  origin: [
    'https://expense-tracker-frontend-iota-seven.vercel.app/',
    'http://localhost:5173',
  ],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: statusMap[readyState] || 'unknown',
    readyState,
  });
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker backend is running');
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.stack || err.message);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;