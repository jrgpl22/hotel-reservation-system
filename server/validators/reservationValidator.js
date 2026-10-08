import { body, query } from 'express-validator';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export const createReservationValidator = [
  body('room').isMongoId().withMessage('A valid room is required'),
  body('checkIn')
    .isISO8601({ strict: true })
    .withMessage('A valid check-in date is required (YYYY-MM-DD)'),
  body('checkOut')
    .isISO8601({ strict: true })
    .withMessage('A valid check-out date is required (YYYY-MM-DD)'),
  body('guests').isInt({ min: 1 }).withMessage('At least 1 guest is required').toInt(),
];

export const availabilityValidator = [
  query('room').isMongoId().withMessage('A valid room is required'),
  query('checkIn')
    .isISO8601({ strict: true })
    .withMessage('A valid check-in date is required (YYYY-MM-DD)'),
  query('checkOut')
    .isISO8601({ strict: true })
    .withMessage('A valid check-out date is required (YYYY-MM-DD)'),
  query('guests').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Guests must be at least 1'),
];

export const updateStatusValidator = [
  body('status')
    .isIn(STATUSES)
    .withMessage('Status must be pending, confirmed, cancelled or completed'),
];

export const listReservationsValidator = [
  query('page').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be 1 or more'),
  query('limit').optional({ checkFalsy: true }).isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional({ checkFalsy: true }).isIn(STATUSES).withMessage('Invalid status filter'),
  query('search').optional({ checkFalsy: true }).isString().withMessage('Search must be text'),
];