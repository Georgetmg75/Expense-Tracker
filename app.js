// app.js
import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker backend is running');
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter); // ✅ Apply globally

export default app;
