import { Router } from 'express';
import { getDashboardStats, getRecentReservations } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/stats', protect, authorize('staff', 'admin'), getDashboardStats);
router.get('/recent-reservations', protect, authorize('staff', 'admin'), getRecentReservations);

export default router;
