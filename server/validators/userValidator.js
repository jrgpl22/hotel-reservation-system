import { body, param, query } from 'express-validator';

const ROLES = ['guest', 'staff', 'admin'];
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

export const userIdValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];

export const listUsersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive whole number'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50'),
  query('role').optional().isIn(ROLES).withMessage('Role must be guest, staff, or admin'),
  query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

export const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 80 }).withMessage('Name must be 80 characters or fewer'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .matches(PHONE_PATTERN).withMessage('Enter a valid phone number'),
  body('role').optional().isIn(ROLES).withMessage('Role must be guest, staff, or admin'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false').toBoolean(),
];