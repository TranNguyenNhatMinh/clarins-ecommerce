/**
 * Product model
 */
import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '../constants/product.js';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: 'Category must be one of: face, makeup, body, men',
      },
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isBeautyMustHave: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model('Product', productSchema);
