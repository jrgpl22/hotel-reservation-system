import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import {
  userIdValidator,
  listUsersValidator,
  updateUserValidator,
} from '../validators/userValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

// Every user-management route is admin-only
router.use(protect, authorize('admin'));

router.get('/', listUsersValidator, validate, getUsers);
router.get('/:id', userIdValidator, validate, getUserById);
router.put('/:id', userIdValidator, updateUserValidator, validate, updateUser);
router.delete('/:id', userIdValidator, validate, deleteUser);

export default router;