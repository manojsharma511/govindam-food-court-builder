import { Router } from 'express';
import { submitContact, getContactSubmissions } from '../controllers/contact.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', submitContact);
router.get('/', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), getContactSubmissions);

export default router;
