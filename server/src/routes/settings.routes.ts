import { Router } from 'express';
import {
    getThemeSettings,
    updateThemeSettings,
    getGlobalSettings,
    updateGlobalSettings,
    getMessages
} from '../controllers/settings.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Theme (Public Read, Super Admin Write)
router.get('/theme', getThemeSettings);
router.put('/theme', authMiddleware, authorize([Role.SUPER_ADMIN]), updateThemeSettings);

// Global Settings (Public Read, Super Admin Write)
router.get('/global', getGlobalSettings);
router.put('/global', authMiddleware, authorize([Role.SUPER_ADMIN]), updateGlobalSettings);

// Messages (Admin Read)
router.get('/messages', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), getMessages);

export default router;
