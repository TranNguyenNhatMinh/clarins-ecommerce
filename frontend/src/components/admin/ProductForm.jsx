import { useState, useEffect } from 'react';
import { PRODUCT_CATEGORIES } from '../../constants/index.js';

export default function ProductForm({ initial, onClose, onSubmit, title }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [isBeautyMustHave, setIsBeautyMustHave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setDescription(initial.description || '');
      setPrice(initial.price?.toString() || '');
      const cat = (initial.category || '').toLowerCase();
      setCategory(PRODUCT_CATEGORIES.includes(cat) ? cat : '');
      setImage(initial.image || '');
      setIsBeautyMustHave(Boolean(initial.isBeautyMustHave));
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage('');
      setIsBeautyMustHave(false);
    }
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Vui lòng nhập tên sản phẩm.');
      return;
    }
    const cat = category.trim().toLowerCase();
    if (!cat || !PRODUCT_CATEGORIES.includes(cat)) {
      setError('Vui lòng chọn danh mục (face, makeup, body, men).');
      return;
    }
    const numPrice = parseFloat(String(price).replace(/,/g, ''));
    if (Number.isNaN(numPrice) || numPrice < 0) {
      setError('Giá phải là số không âm.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        name: trimmedName,
        description: description.trim(),
        price: numPrice,
        category: cat,
        image: image.trim(),
        isBeautyMustHave,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-admin-card rounded-admin-lg shadow-admin-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border border-admin-border">
        <div className="sticky top-0 bg-admin-card px-6 py-4 border-b border-admin-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-admin-text">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-admin text-admin-muted hover:bg-gray-100 hover:text-admin-text transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-admin">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">Tên sản phẩm *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-admin border border-admin-border text-admin-text placeholder-admin-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-admin border border-admin-border text-admin-text placeholder-admin-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">Giá *</label>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-admin border border-admin-border text-admin-text placeholder-admin-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              required
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">Danh mục *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-admin border border-admin-border text-admin-text bg-admin-card focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              required
            >
              <option value="">Chọn danh mục</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">URL ảnh</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-admin border border-admin-border text-admin-text placeholder-admin-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="https://... hoặc đường dẫn ảnh"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isBeautyMustHave"
              checked={isBeautyMustHave}
              onChange={(e) => setIsBeautyMustHave(e.target.checked)}
              className="w-4 h-4 rounded border-admin-border text-brand focus:ring-brand/20"
            />
            <label htmlFor="isBeautyMustHave" className="text-sm font-medium text-admin-text">
              Hiển thị trong Beauty Must Have (trang chủ)
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-admin bg-brand text-white text-sm font-medium hover:bg-brand/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-admin border border-admin-border text-admin-text text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
