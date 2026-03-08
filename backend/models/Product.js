/**
 * Product model - thông tin sản phẩm
 */
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
      maxlength: [100, 'Tên tối đa 100 ký tự'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Mô tả tối đa 500 ký tự'],
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá'],
      min: [0, 'Giá không được âm'],
    },
    category: {
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      trim: true,
      maxlength: [50, 'Danh mục tối đa 50 ký tự'],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model('Product', productSchema);
