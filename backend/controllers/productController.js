/**
 * Product controller - CRUD sản phẩm (public + admin)
 */
import Product from '../models/Product.js';

// GET /api/products - danh sách sản phẩm (public)
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id - chi tiết sản phẩm (public)
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products - tạo sản phẩm (admin)
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công.', data: product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id - sửa sản phẩm (admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }
    res.json({ success: true, message: 'Cập nhật thành công.', data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id - xóa sản phẩm (admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }
    res.json({ success: true, message: 'Đã xóa sản phẩm.' });
  } catch (err) {
    next(err);
  }
};
