import { Router } from 'express';
import { createBooking, getUserBookings, getAllBookings, updateBookingStatus } from '../controllers/booking.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);
router.get('/', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), getAllBookings);
router.put('/:id/status', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), updateBookingStatus);

export default router;
