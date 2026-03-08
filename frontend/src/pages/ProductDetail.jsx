import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../api/services/productService.js';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROUTES } from '../constants/index.js';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    productService
      .getById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Không tìm thấy sản phẩm.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <LoadingSpinner className="min-h-[50vh]" />;
  if (error || !product) return <div className="max-w-7xl mx-auto px-4 py-8 text-red-600">{error || 'Không tìm thấy sản phẩm.'}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to={ROUTES.products} className="text-primary-600 hover:underline mb-4 inline-block">← Quay lại danh sách</Link>
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 aspect-square md:aspect-auto md:min-h-[400px] bg-gray-100">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <span className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary-600 mt-2">{new Intl.NumberFormat('vi-VN').format(product.price)} ₫</p>
          <p className="text-gray-600 mt-4">{product.description || 'Chưa có mô tả.'}</p>
          <p className="text-sm text-gray-400 mt-4">Ngày tạo: {new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
    </div>
  );
}
