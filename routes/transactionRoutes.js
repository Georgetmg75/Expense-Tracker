// routes/transactionRoutes.js
import express from 'express';
import {
  fetchTransactions,
  addTransaction,
  editTransaction,
  removeTransaction,
} from '../controllers/transactionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); // protect all routes

router.get('/', fetchTransactions);
router.post('/', addTransaction);
router.put('/:id', editTransaction);
router.delete('/:id', removeTransaction);

export default router;
