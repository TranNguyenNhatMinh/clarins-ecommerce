/**
 * Section products on homepage - fetches from API and displays product grid
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../api/services/productService.js';
import { ROUTES } from '../../constants/index.js';

export default function RelatedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    productService
      .getList({ beautyMustHave: true })
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5">
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-wide mb-2">
            Beauty Must Have
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Hand-picked by us
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <Link
                key={p._id}
                to={ROUTES.productDetail(p._id)}
                className="group block overflow-hidden"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-brand transition">
                    {p.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    {new Intl.NumberFormat('en-US').format(typeof p.price === 'number' ? p.price : 0)} ₫
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500 py-8">No products yet.</p>
        )}
      </div>
    </section>
  );
}
