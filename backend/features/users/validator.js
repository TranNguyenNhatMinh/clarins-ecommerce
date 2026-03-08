/**
 * Validation for profile update
 */
import { body, validationResult } from 'express-validator';

export const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 50 }).withMessage('Name must be at most 50 characters'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  next();
};
