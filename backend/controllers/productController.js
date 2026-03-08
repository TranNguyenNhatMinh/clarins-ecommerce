/**
 * Product controller - CRUD sản phẩm (public + admin)
 */
import Product from '../models/Product.js';

// GET /api/products - list products (public). Query: category=face|makeup|body|men, beautyMustHave=true
const PRODUCT_CATEGORIES = ['face', 'makeup', 'body', 'men'];
export const getProducts = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && PRODUCT_CATEGORIES.includes(String(req.query.category).toLowerCase())) {
      filter.category = String(req.query.category).toLowerCase();
    }
    if (req.query.beautyMustHave === 'true') {
      filter.isBeautyMustHave = true;
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
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
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products - tạo sản phẩm (admin)
export const createProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.isBeautyMustHave !== undefined) body.isBeautyMustHave = Boolean(body.isBeautyMustHave);
    const product = await Product.create(body);
    res.status(201).json({ success: true, message: 'Product created successfully.', data: product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id - sửa sản phẩm (admin) - chỉ cập nhật field cho phép
const ALLOWED_PRODUCT_FIELDS = ['name', 'description', 'price', 'category', 'image', 'isBeautyMustHave'];
export const updateProduct = async (req, res, next) => {
  try {
    const updates = {};
    for (const key of ALLOWED_PRODUCT_FIELDS) {
      if (req.body[key] === undefined) continue;
      if (key === 'price') {
        const n = Number(req.body[key]);
        if (!Number.isNaN(n) && n >= 0) updates[key] = n;
      } else if (key === 'isBeautyMustHave') {
        updates[key] = Boolean(req.body[key]);
      } else {
        updates[key] = req.body[key];
      }
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product updated successfully.', data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id - xóa sản phẩm (admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};
