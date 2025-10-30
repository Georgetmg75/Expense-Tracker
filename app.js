import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import expenseRoutes from './routes/expenses.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import debug from 'debug';

const log = debug('expense-tracker:server');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
  credentials: true,
}));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Health check route for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker backend is running');
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter); // ✅ Apply globally

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  log('❌ Unhandled error:', err.stack || err.message);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
