import { body } from 'express-validator';

const IMAGE_PATTERN = /^(\/api\/images\/[0-9a-f]{24}|https?:\/\/\S+|photo-[A-Za-z0-9_-]+)$/;

const imageRules = [
  body('images').optional().isArray({ max: 6 }).withMessage('A room can have at most 6 photos'),
  body('images.*').optional().isString().trim().matches(IMAGE_PATTERN).withMessage('One of the photos is not valid'),
];

export const createRoomValidator = [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('roomType').trim().notEmpty().withMessage('Room type is required'),
  body('pricePerNight').isFloat({ min: 0 }).withMessage('Price per night must be a positive number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('bedType').optional().trim(),
  body('description').optional().trim(),
  body('amenities').optional().isArray().withMessage('Amenities must be a list'),
  body('status').optional().isIn(['available', 'maintenance']).withMessage('Status must be available or maintenance'),
  ...imageRules,
];

export const updateRoomValidator = [
  body('roomNumber').optional().trim().notEmpty().withMessage('Room number cannot be empty'),
  body('roomType').optional().trim().notEmpty().withMessage('Room type cannot be empty'),
  body('pricePerNight').optional().isFloat({ min: 0 }).withMessage('Price per night must be a positive number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('bedType').optional().trim(),
  body('description').optional().trim(),
  body('amenities').optional().isArray().withMessage('Amenities must be a list'),
  body('status').optional().isIn(['available', 'maintenance']).withMessage('Status must be available or maintenance'),
  ...imageRules,
];