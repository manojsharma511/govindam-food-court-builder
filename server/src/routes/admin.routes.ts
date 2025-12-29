import { Router } from 'express';
import { getOrders, updateOrderStatus, getBookings, updateBookingStatus } from '../controllers/admin.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/orders', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), getOrders);
router.put('/orders/:id/status', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), updateOrderStatus);

router.get('/bookings', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), getBookings);
router.put('/bookings/:id/status', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), updateBookingStatus);

export default router;
