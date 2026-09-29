import { body } from 'express-validator';

export const createRoomValidator = [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('roomType').trim().notEmpty().withMessage('Room type is required'),
  body('pricePerNight').isFloat({ min: 0 }).withMessage('Price per night must be a positive number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('bedType').optional().trim(),
  body('description').optional().trim(),
  body('amenities').optional().isArray().withMessage('Amenities must be a list'),
  body('image').optional().trim(),
  body('status').optional().isIn(['available', 'maintenance']).withMessage('Status must be available or maintenance'),
];

export const updateRoomValidator = [
  body('roomNumber').optional().trim().notEmpty().withMessage('Room number cannot be empty'),
  body('roomType').optional().trim().notEmpty().withMessage('Room type cannot be empty'),
  body('pricePerNight').optional().isFloat({ min: 0 }).withMessage('Price per night must be a positive number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('bedType').optional().trim(),
  body('description').optional().trim(),
  body('amenities').optional().isArray().withMessage('Amenities must be a list'),
  body('image').optional().trim(),
  body('status').optional().isIn(['available', 'maintenance']).withMessage('Status must be available or maintenance'),
];