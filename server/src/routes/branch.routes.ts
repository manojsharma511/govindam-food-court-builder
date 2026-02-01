import express from 'express';
import { getBranches, createBranch, updateBranch, deleteBranch } from '../controllers/branch.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, authorize(['ADMIN', 'SUPER_ADMIN']), getBranches);
router.post('/', authMiddleware, authorize(['SUPER_ADMIN']), createBranch);
router.put('/:id', authMiddleware, authorize(['SUPER_ADMIN']), updateBranch);
router.delete('/:id', authMiddleware, authorize(['SUPER_ADMIN']), deleteBranch);

export default router;
