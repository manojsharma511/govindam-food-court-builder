
import { Router } from 'express';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/team.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public Read
router.get('/', getTeamMembers);

// Admin Write
router.post('/', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), createTeamMember);
router.put('/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), updateTeamMember);
router.delete('/:id', authMiddleware, authorize([Role.ADMIN, Role.SUPER_ADMIN]), deleteTeamMember);

export default router;
