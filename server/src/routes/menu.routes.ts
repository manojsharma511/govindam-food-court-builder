import { Router } from 'express';
import { getMenu, createCategory, createItem, updateItem, deleteItem } from '../controllers/menu.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getMenu);

// Admin routes
router.post('/categories', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), createCategory);
router.post('/items', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), createItem);
router.put('/items/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), updateItem);
router.delete('/items/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), deleteItem);

export default router;
