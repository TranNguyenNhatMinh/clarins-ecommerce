/**
 * Section dịch vụ / trải nghiệm thương hiệu - grid 2x2 cards
 */
import { Link } from 'react-router-dom';
import { SERVICES } from '../../constants/homeConfig.js';

export default function ServicesSection() {
  return (
    <section className="bg-white py-10 sm:py-14 md:py-16 lg:py-20 border-t border-gray-100">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5">
        <header className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 tracking-wide mb-2">
            Our exclusive services
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Brand experience
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
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
