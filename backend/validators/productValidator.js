/**
 * Validation for Product (create, update)
 */
import { body, validationResult } from 'express-validator';
import { PRODUCT_CATEGORIES } from '../constants/product.js';

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Please enter product name').isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
  body('price')
    .exists({ checkFalsy: false })
    .withMessage('Please enter price')
    .custom((val) => {
      const n = Number(val);
      return !Number.isNaN(n) && n >= 0;
    })
    .withMessage('Price must be a non-negative number')
    .toFloat(),
  body('category')
    .trim()
    .customSanitizer((val) => (val ? String(val).toLowerCase() : val))
    .notEmpty()
    .withMessage('Please select category')
    .isIn(PRODUCT_CATEGORIES)
    .withMessage('Category must be one of: face, makeup, body, men'),
  body('image').optional().trim(),
  body('isBeautyMustHave').optional().isBoolean().withMessage('Beauty Must Have must be true or false'),
];

export const updateProductValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
  body('price')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') return true;
      const n = Number(value);
      return !Number.isNaN(n) && n >= 0;
    })
    .withMessage('Price must be a non-negative number'),
  body('category')
    .optional()
    .trim()
    .customSanitizer((val) => (val ? String(val).toLowerCase() : val))
    .isIn(PRODUCT_CATEGORIES)
    .withMessage('Category must be one of: face, makeup, body, men'),
  body('image').optional().trim(),
  body('isBeautyMustHave').optional().isBoolean().withMessage('Beauty Must Have must be true or false'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  next();
};
