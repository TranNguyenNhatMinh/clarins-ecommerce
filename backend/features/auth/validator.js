/**
 * Validation for register and login
 */
import { body, validationResult } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Please enter your name').isLength({ max: 50 }).withMessage('Name must be at most 50 characters'),
  body('email').trim().notEmpty().withMessage('Please enter email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Please enter password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .notEmpty()
    .withMessage('Please enter phone number')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Phone number must be between 6 and 20 characters')
    .matches(/^[0-9+\s\-()]*$/)
    .withMessage('Invalid phone number'),
];

export const loginValidation = [
  body('email').trim().notEmpty().withMessage('Please enter email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Please enter password'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  next();
};
