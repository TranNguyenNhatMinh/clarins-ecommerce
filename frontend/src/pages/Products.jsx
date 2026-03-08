import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../api/services/productService.js';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROUTES, PRODUCT_CATEGORIES } from '../constants/index.js';

const CATEGORY_LABELS = { face: 'Face', makeup: 'Makeup', body: 'Body', men: 'Men' };

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')?.toLowerCase() || '';
  const category = PRODUCT_CATEGORIES.includes(categoryParam) ? categoryParam : null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    productService
      .getList(category ? { category } : {})
      .then((data) => {
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load products.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [category]);

  const pageTitle = category ? CATEGORY_LABELS[category] : 'Products';

  if (loading) return <LoadingSpinner className="min-h-[50vh]" />;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {category
          ? `Products in ${CATEGORY_LABELS[category]} category.`
          : 'Browse all products or filter by category below.'}
      </p>

      {!category && (
        <div className="flex flex-wrap gap-2 mb-6">
          {PRODUCT_CATEGORIES.map((c) => (
            <Link
              key={c}
              to={ROUTES.productsByCategory(c)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
            >
              {CATEGORY_LABELS[c]}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-gray-500 text-center py-12">
            {category ? `No products in ${CATEGORY_LABELS[category]} yet.` : 'No products yet.'}
          </p>
        ) : (
          products.map((p) => (
            <Link
              key={p._id}
              to={ROUTES.productDetail(p._id)}
              className="group bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                <p className="text-primary-600 font-medium mt-1">{new Intl.NumberFormat('en-US').format(p.price)} ₫</p>
                <p className="text-sm text-gray-500 mt-1">{p.category ? CATEGORY_LABELS[p.category] || p.category : ''}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
