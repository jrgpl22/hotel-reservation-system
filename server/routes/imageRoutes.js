import { Router } from 'express';
import { param } from 'express-validator';
import { getImage, uploadImage } from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/:id', param('id').isMongoId().withMessage('Invalid image ID'), validate, getImage);

// protect runs before multer, so unauthenticated requests never get their file buffered
router.post('/room', protect, authorize('admin'), uploadSingleImage, uploadImage('room'));
router.post('/avatar', protect, uploadSingleImage, uploadImage('avatar'));

export default router;