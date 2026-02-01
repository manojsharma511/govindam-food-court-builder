import { Router } from 'express';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public Read
router.get('/', getGalleryImages);

// Admin Write
router.post('/', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), addGalleryImage);
router.delete('/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), deleteGalleryImage);

export default router;
