/**
 * Section nổi bật - split layout: ảnh trái, nội dung + CTA phải
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/index.js';
import { HIGHLIGHT_PROMO } from '../../constants/homeConfig.js';

export default function HighlightPromo() {
  const ctaTo = HIGHLIGHT_PROMO.ctaTo || ROUTES.products;
  const firstSpace = HIGHLIGHT_PROMO.title.indexOf(' ');
  const titlePrimary = firstSpace > 0 ? HIGHLIGHT_PROMO.title.slice(0, firstSpace) : HIGHLIGHT_PROMO.title;
  const titleSecondary = firstSpace > 0 ? HIGHLIGHT_PROMO.title.slice(firstSpace).trim() : '';
  return (
    <section className="bg-stone-50 py-16 md:py-24">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[540px] gap-0 overflow-hidden rounded-lg shadow-md bg-white">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[540px] overflow-hidden bg-gray-100">
            <img
              src={HIGHLIGHT_PROMO.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center items-center text-center min-h-[300px] lg:min-h-[540px] p-8 md:p-12 lg:p-16 bg-[#FDFBF8] lg:border-l border-gray-100">
            <div className="flex gap-2 mb-6" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-brand text-3xl md:text-4xl" aria-hidden>★</span>
              ))}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
              <span className="font-semibold">{titlePrimary}</span>
              {titleSecondary && <span className="font-normal text-2xl md:text-3xl text-gray-700"> {titleSecondary}</span>}
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-md mb-8 leading-relaxed">
              {HIGHLIGHT_PROMO.body}
            </p>
            <Link
              to={ctaTo}
              className="inline-block px-8 py-3 bg-white text-gray-800 text-sm font-medium tracking-wide border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              {HIGHLIGHT_PROMO.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
