// routes/summaryRoutes.js
import express from 'express';
import { getMonthlySummary, getCategorySummary } from '../controllers/summaryController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); // protect all routes

router.get('/monthly', getMonthlySummary);
router.get('/category', getCategorySummary);

export default router;
