/**
 * Validation cho đăng ký, đăng nhập
 */
import { body, validationResult } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên').isLength({ max: 50 }).withMessage('Tên tối đa 50 ký tự'),
  body('email').trim().notEmpty().withMessage('Vui lòng nhập email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
];

export const loginValidation = [
  body('email').trim().notEmpty().withMessage('Vui lòng nhập email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  next();
};
