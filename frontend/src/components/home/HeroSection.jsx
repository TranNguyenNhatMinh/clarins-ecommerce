/**
 * Hero banner lớn full-width, text overlay, CTA - phong cách editorial/beauty
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/index.js';
import { HERO } from '../../constants/homeConfig.js';

export default function HeroSection() {
  const ctaTo = HERO.ctaTo || ROUTES.products;
  return (
    <section className="relative w-full aspect-[16/9] min-h-[320px] max-h-[85vh] bg-gray-100 overflow-hidden">
      <img
        src={HERO.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-[0.2em] uppercase mb-3">
          {HERO.title}
        </h1>
        <p className="text-sm sm:text-base text-white/90 max-w-lg mb-8 tracking-wide">
          {HERO.subtitle}
        </p>
        <Link
          to={ctaTo}
          className="px-8 py-3 bg-white text-gray-900 font-medium text-sm tracking-widest uppercase hover:bg-gray-100 transition"
        >
          {HERO.ctaText}
        </Link>
      </div>
    </section>
  );
}
