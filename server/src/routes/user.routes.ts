import { Router } from 'express';
import { getUsers, createAdmin, deleteUser, updateUser } from '../controllers/user.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Only Super Admin can manage users/admins
router.get('/', authMiddleware, authorize([Role.SUPER_ADMIN]), getUsers);
router.post('/admin', authMiddleware, authorize([Role.SUPER_ADMIN]), createAdmin);
router.put('/:id', authMiddleware, authorize([Role.SUPER_ADMIN]), updateUser);
router.delete('/:id', authMiddleware, authorize([Role.SUPER_ADMIN]), deleteUser);

export default router;
