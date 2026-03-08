/**
 * Section dịch vụ / trải nghiệm thương hiệu - grid 2x2 cards
 */
import { Link } from 'react-router-dom';
import { SERVICES } from '../../constants/homeConfig.js';

export default function ServicesSection() {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5">
        <header className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-wide mb-2">
            Dịch vụ độc quyền
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Trải nghiệm thương hiệu
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="group block overflow-hidden bg-gray-50 rounded-sm"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.image}
                  alt=""
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-sm font-medium tracking-[0.1em] text-gray-900 uppercase group-hover:text-brand transition">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                <span className="inline-block mt-3 text-xs font-medium tracking-widest uppercase text-gray-600 group-hover:text-brand transition">
                  Tìm hiểu thêm
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
