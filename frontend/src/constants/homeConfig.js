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
  { name: 'FACE', slug: 'face', tagline: 'Shop all Face', to: '/products?category=face', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80' },
  { name: 'MAKEUP', slug: 'makeup', tagline: 'Shop all Makeup', to: '/products?category=makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { name: 'BODY', slug: 'body', tagline: 'Shop all Body', to: '/products?category=body', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { name: 'MEN', slug: 'men', tagline: 'Shop all Men', to: '/products?category=men', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80' },
];

export const HIGHLIGHT_PROMO = {
  title: '1,200+ 5-Star Reviews',
  body: 'Discover why customers love our products.',
  ctaText: 'Shop now',
  ctaTo: '/products',
  image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
};

export const SERVICES = [
  { title: 'FIND YOUR SKIN SOLUTION', desc: 'Personalized consultation', to: '/', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
  { title: 'E-CONSULTATION', desc: 'Online consultation', to: '/', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80' },
  { title: 'GIFT FINDER', desc: 'Find the perfect gift', to: '/products', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80' },
  { title: 'VIRTUAL TRY-ON', desc: 'Try on virtually', to: '/', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
];
