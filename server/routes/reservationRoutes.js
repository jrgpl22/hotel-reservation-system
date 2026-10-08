import { Router } from 'express';
import {
  checkAvailability,
  getBookedRanges,
  createReservation,
  getMyReservations,
  getAllReservations,
  getReservationById,
  cancelReservation,
  updateReservationStatus,
} from '../controllers/reservationController.js';
import {
  createReservationValidator,
  availabilityValidator,
  updateStatusValidator,
  listReservationsValidator,
} from '../validators/reservationValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

// Fixed paths must come BEFORE '/:id' or Express treats "my" as an id.
router.get('/availability', protect, availabilityValidator, validate, checkAvailability);
router.get('/booked', protect, getBookedRanges);
router.get('/my', protect, listReservationsValidator, validate, getMyReservations);

router.get('/', protect, authorize('staff', 'admin'), listReservationsValidator, validate, getAllReservations);
router.post('/', protect, createReservationValidator, validate, createReservation);

router.get('/:id', protect, getReservationById);
router.patch('/:id/cancel', protect, cancelReservation);
router.patch('/:id/status', protect, authorize('staff', 'admin'), updateStatusValidator, validate, updateReservationStatus);

export default router;