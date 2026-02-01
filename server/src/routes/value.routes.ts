
import { Router } from 'express';
import { getValues, createValue, updateValue, deleteValue } from '../controllers/value.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public Read
router.get('/', getValues);

// Admin Write
router.post('/', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), createValue);
router.put('/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), updateValue);
router.delete('/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), deleteValue);

export default router;
