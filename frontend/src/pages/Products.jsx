import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../api/services/productService.js';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROUTES } from '../constants/index.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    productService
      .getList()
      .then((data) => {
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Không tải được danh sách sản phẩm.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSpinner className="min-h-[50vh]" />;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-gray-500 text-center py-12">Chưa có sản phẩm nào.</p>
        ) : (
          products.map((p) => (
            <Link key={p._id} to={ROUTES.productDetail(p._id)} className="group bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-lg transition">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                <p className="text-primary-600 font-medium mt-1">{new Intl.NumberFormat('vi-VN').format(p.price)} ₫</p>
                <p className="text-sm text-gray-500 mt-1">{p.category}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
