/**
 * Section danh mục - tiêu đề lớn, grid card ảnh, tagline
 */
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../constants/homeConfig.js';

export default function CategoryShowcase() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5">
        <header className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-wide mb-2">
            Làn da của bạn. Chuyên môn của chúng tôi.
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Khám phá công thức phù hợp với bạn
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group block overflow-hidden bg-gray-100 rounded-sm"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt=""
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <span className="text-xs font-medium tracking-[0.15em] text-gray-700 uppercase">
                  {cat.name}
                </span>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-brand transition">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
