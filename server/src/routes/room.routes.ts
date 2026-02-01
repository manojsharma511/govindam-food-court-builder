import express from 'express';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/room.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, authorize(['ADMIN', 'SUPER_ADMIN']), getRooms);
router.post('/', authMiddleware, authorize(['SUPER_ADMIN']), createRoom);
router.put('/:id', authMiddleware, authorize(['SUPER_ADMIN']), updateRoom);
router.delete('/:id', authMiddleware, authorize(['SUPER_ADMIN']), deleteRoom);

export default router;
