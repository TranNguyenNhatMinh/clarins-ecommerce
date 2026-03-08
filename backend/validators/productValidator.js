/**
 * Validation cho Product (create, update)
 */
import { body, validationResult } from 'express-validator';

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm').isLength({ max: 100 }).withMessage('Tên tối đa 100 ký tự'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Mô tả tối đa 500 ký tự'),
  body('price').notEmpty().withMessage('Vui lòng nhập giá').isFloat({ min: 0 }).withMessage('Giá phải là số không âm'),
  body('category').trim().notEmpty().withMessage('Vui lòng nhập danh mục').isLength({ max: 50 }).withMessage('Danh mục tối đa 50 ký tự'),
  body('image').optional().trim(),
];

export const updateProductValidation = [
  body('name').optional().trim().notEmpty().withMessage('Tên không được để trống').isLength({ max: 100 }).withMessage('Tên tối đa 100 ký tự'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Mô tả tối đa 500 ký tự'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Giá phải là số không âm'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Danh mục tối đa 50 ký tự'),
  body('image').optional().trim(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  next();
};
