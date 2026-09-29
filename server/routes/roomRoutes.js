import { Router } from 'express';
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { createRoomValidator, updateRoomValidator } from '../validators/roomValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getRooms);
router.get('/:id', optionalAuth, getRoomById);

router.post('/', protect, authorize('admin'), createRoomValidator, validate, createRoom);
router.put('/:id', protect, authorize('admin'), updateRoomValidator, validate, updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

export default router;