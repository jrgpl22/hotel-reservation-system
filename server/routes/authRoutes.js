import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
} from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', loginValidator, validate, loginUser);
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);

export default router;