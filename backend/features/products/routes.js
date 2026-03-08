import express from 'express';
import { protect } from '../../middleware/auth.js';
import { adminOnly } from '../../middleware/admin.js';
import { validateObjectId } from '../../middleware/validateObjectId.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './controller.js';
import {
  createProductValidation,
  updateProductValidation,
  validate as productValidate,
} from './validator.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', validateObjectId('id'), getProductById);

router.post('/', protect, adminOnly, createProductValidation, productValidate, createProduct);
router.put('/:id', protect, adminOnly, validateObjectId('id'), updateProductValidation, productValidate, updateProduct);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), deleteProduct);

export default router;
