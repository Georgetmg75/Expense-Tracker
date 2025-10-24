// app.js
import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker backend is running');
});

export default app;
