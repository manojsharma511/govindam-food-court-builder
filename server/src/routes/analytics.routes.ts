import express from 'express';
import { getOverview, getSalesData } from '../controllers/analytics.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/overview', authMiddleware, authorize(['ADMIN', 'SUPER_ADMIN']), getOverview);
router.get('/sales', authMiddleware, authorize(['ADMIN', 'SUPER_ADMIN']), getSalesData);

export default router;
