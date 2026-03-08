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
          className="inline-flex items-center justify-center min-w-[180px] px-10 py-3.5 bg-white/95 text-brand font-medium text-sm tracking-[0.18em] uppercase rounded-md border border-white/80 shadow-lg hover:bg-brand hover:text-white hover:border-brand active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand/20 transition-all duration-1000"
        >
          {HERO.ctaText}
        </Link>
      </div>
    </section>
  );
}
