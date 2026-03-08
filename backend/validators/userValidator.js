/**
 * Validation cho cập nhật profile
 */
import { body, validationResult } from 'express-validator';

export const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Tên không được để trống').isLength({ max: 50 }).withMessage('Tên tối đa 50 ký tự'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  next();
};
