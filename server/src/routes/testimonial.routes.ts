
import { Router } from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public Read
router.get('/', getTestimonials);

// Admin Write
// Create (Authenticated Users, but hidden by default unless Admin)
router.post('/', authMiddleware, createTestimonial);
router.put('/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), updateTestimonial);
router.delete('/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), deleteTestimonial);

export default router;
