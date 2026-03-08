/**
 * Section nổi bật - split layout: ảnh trái, nội dung + CTA phải
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/index.js';
import { HIGHLIGHT_PROMO } from '../../constants/homeConfig.js';

export default function HighlightPromo() {
  const ctaTo = HIGHLIGHT_PROMO.ctaTo || ROUTES.products;
  return (
    <section className="bg-stone-50 py-16 md:py-24">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-sm bg-white shadow-sm">
          <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[400px] overflow-hidden">
            <img
              src={HIGHLIGHT_PROMO.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <div className="flex gap-1 mb-4" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-brand" aria-hidden>★</span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">
              {HIGHLIGHT_PROMO.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6">
              {HIGHLIGHT_PROMO.body}
            </p>
            <Link
              to={ctaTo}
              className="inline-block w-fit px-6 py-2.5 bg-brand text-white text-sm font-medium tracking-widest uppercase hover:bg-brand-600 transition"
            >
              {HIGHLIGHT_PROMO.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
