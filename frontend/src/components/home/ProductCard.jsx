/**
 * Card sản phẩm - ảnh, tên, giá, rating, badge; hover nhẹ
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/index.js';

export default function ProductCard({ product, showBadge = false }) {
  const id = product._id || product.id;
  const price = typeof product.price === 'number' ? product.price : 0;
  const rating = product.rating ?? 5;

  return (
    <Link
      to={ROUTES.productDetail(id)}
      className="group block bg-white overflow-hidden"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
        {showBadge && (
          <span className="absolute top-2 left-2 bg-brand text-white text-xs font-medium px-2 py-0.5 tracking-wider uppercase">
            Bán chạy
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-brand transition">
          {product.name}
        </h3>
        <div className="flex gap-0.5 mt-1 text-brand text-xs" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i}>{i <= rating ? '★' : '☆'}</span>
          ))}
        </div>
        <p className="text-sm font-medium text-gray-700 mt-2">
          {new Intl.NumberFormat('vi-VN').format(price)} ₫
        </p>
      </div>
    </Link>
  );
}
