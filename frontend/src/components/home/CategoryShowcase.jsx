/**
 * Category showcase — premium section with refined typography and hover states
 */
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../constants/homeConfig.js';

export default function CategoryShowcase() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-3">
            Your skin. Our expertise.
          </h2>
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500 font-medium">
            Discover our tailored formulas
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group block overflow-hidden bg-gray-100 rounded-sm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt=""
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-5 py-5 text-center">
                <span className="block text-sm font-medium tracking-[0.18em] text-gray-800 uppercase">
                  {cat.name}
                </span>
                <span className="mt-2 inline-block text-sm font-medium tracking-[0.08em] text-gray-500 group-hover:text-brand transition">
                  {cat.tagline}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
