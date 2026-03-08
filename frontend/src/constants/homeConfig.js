/**
 * Mock/config for homepage - can be replaced with API later
 */
export const ANNOUNCEMENT = {
  text: 'Free shipping on orders over $50 · Exclusive offers when you sign up',
};

export const HERO = {
  title: '7 DAYS TO FIRM & GLOW',
  subtitle: 'Our most loved skincare collection',
  ctaText: 'Shop now',
  ctaTo: '/products',
  image: 'https://www.carecredit.com/sites/cc/image/day_spa_treatments.jpg',
};

export const USP_ITEMS = [
  { icon: 'truck', text: 'Free shipping' },
  { icon: 'gift', text: 'Free samples' },
  { icon: 'return', text: 'Easy returns' },
];

/** Category slugs must match PRODUCT_CATEGORIES (face, makeup, body, men) */
export const CATEGORIES = [
  { name: 'FACE', slug: 'face', tagline: 'Shop all Face', to: '/products?category=face', image: 'https://www.clarinsusa.com/on/demandware.static/-/Library-Sites-clarins-v3/default/dw6a161555/Homepage_CBA/Highlights/HIGHLIGHT_FACE-CARE-2025.png' },
  { name: 'MAKEUP', slug: 'makeup', tagline: 'Shop all Makeup', to: '/products?category=makeup', image: 'https://www.clarinsusa.com/on/demandware.static/-/Library-Sites-clarins-v3/default/dw7064c7fd/Homepage_CBA/Highlights/HIGHLIGHT_MAKE-UP-2025.png' },
  { name: 'BODY', slug: 'body', tagline: 'Shop all Body', to: '/products?category=body', image: 'https://www.clarinsusa.com/on/demandware.static/-/Library-Sites-clarins-v3/default/dwf2edfec1/Homepage_CBA/Highlights/HIGHLIGHT_BODY-CARE-2025.png' },
  { name: 'MEN', slug: 'men', tagline: 'Shop all Men', to: '/products?category=men', image: 'https://www.clarinsusa.com/on/demandware.static/-/Library-Sites-clarins-v3/default/dw17661fd5/Homepage_CBA/Highlights/HIGHLIGHT_MEN-SOIN-LISSANT-RIDES-FERMETE-2025.png' },
];

export const HIGHLIGHT_PROMO = {
  title: '1,200+ 5-Star Reviews',
  body: 'Discover why customers love our products.',
  ctaText: 'Shop now',
  ctaTo: '/products',
  image: 'https://bizweb.dktcdn.net/100/457/257/products/428619517-1591296254980348-2842381259070112768-n-jpg-nc-cat-102-ccb-1-7-nc-sid-5f2048-nc-ohc-rftchcag6raq7knvghxcdxz-nc-ht-scontent-fvca2-1-fna-oh-00-aydilujavemgpahejxdcfsw0sh39cktja6wxuxei4cwxyq-oe-6649267e.jpg?v=1715693114500',
};

export const SERVICES = [
  { title: 'FIND YOUR SKIN SOLUTION', desc: 'Personalized consultation', to: '/', image: 'img/body_3/first_image.png' },
  { title: 'E-CONSULTATION', desc: 'Online consultation', to: '/', image: 'img/body_3/second_image.webp' },
  { title: 'GIFT FINDER', desc: 'Find the perfect gift', to: '/products', image: 'img/body_3/third_image.webp' },
  { title: 'VIRTUAL TRY-ON', desc: 'Try on virtually', to: '/', image: 'img/body_3/four_image.webp' },
];
