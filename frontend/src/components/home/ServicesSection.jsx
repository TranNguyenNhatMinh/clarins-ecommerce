/**
 * Section dịch vụ / trải nghiệm thương hiệu - grid 2x2 cards
 */
import { Link } from 'react-router-dom';
import { SERVICES } from '../../constants/homeConfig.js';

export default function ServicesSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 border-t border-gray-100">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 sm:mb-12 lg:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-light text-gray-900 tracking-[0.12em] mb-3 uppercase">
            Our exclusive services
          </h2>
          <p className="text-[0.7rem] sm:text-xs uppercase tracking-[0.25em] text-gray-500">
            Created to make your life more beautiful
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="group block overflow-hidden bg-white rounded-md border border-gray-200 shadow-[0_1px_3px_rgba(15,23,42,0.08)] hover:shadow-[0_8px_22px_rgba(15,23,42,0.16)] transition-shadow duration-300"
            >
              <div className="aspect-[5/4] overflow-hidden">
                <img
                  src={s.image}
                  alt=""
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-5 pb-6 pt-4 md:px-6 md:pb-7">
                <h3 className="text-[0.75rem] sm:text-sm font-semibold tracking-[0.16em] text-gray-900 uppercase group-hover:text-brand transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{s.desc}</p>
                <span className="inline-block mt-4 text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-gray-700 group-hover:text-brand transition-colors">
                  Learn more
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
