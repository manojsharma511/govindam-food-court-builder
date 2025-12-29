import { Router } from 'express';
import {
    getPages,
    getPageBySlug,
    createPage,
    deletePage,
    updateSection,
    createSection,
    deleteSection
} from '../controllers/page.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/public/:slug', getPageBySlug);

// Admin Pages
router.get('/', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), getPages);
router.post('/', authMiddleware, authorize([Role.SUPER_ADMIN]), createPage);
router.delete('/:id', authMiddleware, authorize([Role.SUPER_ADMIN]), deletePage);

// Admin Sections
router.post('/section', authMiddleware, authorize([Role.SUPER_ADMIN]), createSection);
router.put('/section/:id', authMiddleware, authorize([Role.SUPER_ADMIN]), updateSection);
router.delete('/section/:id', authMiddleware, authorize([Role.SUPER_ADMIN]), deleteSection);

export default router;
