/**
 * Section sản phẩm nổi bật - lấy từ API hoặc mock, grid product cards
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../api/services/productService.js';
import { ROUTES } from '../../constants/index.js';
import ProductCard from './ProductCard.jsx';

export default function BestSellersSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    productService
      .getList()
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5">
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-wide mb-2">
            Sản phẩm đáng mua
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
            Khám phá sản phẩm bán chạy nhất
          </p>
          <div className="flex justify-center gap-4 text-xs font-medium tracking-widest uppercase text-gray-500">
            <Link to={ROUTES.products} className="hover:text-gray-900 transition">
              Xem theo danh mục
            </Link>
            <Link to={ROUTES.products} className="hover:text-gray-900 transition">
              Xem tất cả
            </Link>
          </div>
        </header>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} showBadge={i < 2} />
            ))}
          </div>
        )}
        {!loading && products.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to={ROUTES.products}
              className="inline-block px-8 py-3 border border-gray-800 text-gray-800 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 hover:text-white transition"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
