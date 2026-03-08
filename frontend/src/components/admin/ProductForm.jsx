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
      setError('Please enter product name.');
      return;
    }
    const cat = category.trim().toLowerCase();
    if (!cat || !PRODUCT_CATEGORIES.includes(cat)) {
      setError('Please select a category (face, makeup, body, or men).');
      return;
    }
    const numPrice = parseFloat(String(price).replace(/,/g, ''));
    if (Number.isNaN(numPrice) || numPrice < 0) {
      setError('Price must be a non-negative number.');
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
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input type="number" min={0} step="any" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="https://... or image path" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isBeautyMustHave"
              checked={isBeautyMustHave}
              onChange={(e) => setIsBeautyMustHave(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isBeautyMustHave" className="text-sm font-medium text-gray-700">
              Show in Beauty Must Have (homepage)
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
