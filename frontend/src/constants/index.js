/**
 * Shared constants - easy to change brand / copy later
 */
export const APP_NAME = 'ProductHub';

/** Header logo path (file in public/, e.g. '/logo.png'). Use '' to show APP_NAME text */
export const HEADER_LOGO = '/img/header_img/logo.svg';

export const ROUTES = {
  home: '/',
  products: '/products',
  /** Link to product list filtered by category (face, makeup, body, men) */
  productsByCategory: (category) => `/products?category=${encodeURIComponent(category)}`,
  productDetail: (id) => `/products/${id}`,
  login: '/login',
  register: '/register',
  profile: '/profile',
  admin: {
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    users: '/admin/users',
    subscribers: '/admin/subscribers',
  },
};

/** Header menu - left group */
export const HEADER_NAV_LEFT = [
  { label: "What's New", to: '/' },
  { label: 'Best Sellers', to: '/products' },
  { label: 'Products', to: '/products' },
  { label: 'Gifts', to: '/products' },
  { label: 'Promotions', to: '/' },
];

/** Header menu - right group */
export const HEADER_NAV_RIGHT = [
  { label: 'Services', to: '/' },
  { label: 'About', to: '/' },
];

/** Footer - 4 columns */
export const FOOTER_COLUMNS = [
  {
    title: 'Featured products',
    links: [
      { label: 'New arrivals', to: '/products' },
      { label: 'Best sellers', to: '/products' },
      { label: 'Electronics', to: '/products' },
      { label: 'Accessories', to: '/products' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Track order', to: '/' },
      { label: 'FAQ', to: '/' },
      { label: 'Shipping policy', to: '/' },
      { label: 'Returns policy', to: '/' },
      { label: 'Payment methods', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Loyalty program', to: '/' },
      { label: 'Newsletter signup', to: '/' },
      { label: 'Gift Card', to: '/' },
      { label: 'Refer a friend', to: '/' },
      { label: 'Store locator', to: '/' },
    ],
  },
  {
    title: 'About us',
    links: [
      { label: 'About', to: '/' },
      { label: 'Commitments', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Affiliate program', to: '/' },
    ],
  },
];

/** Product categories - must match backend (face, makeup, body, men) */
export const PRODUCT_CATEGORIES = ['face', 'makeup', 'body', 'men'];

/** Footer - legal links bottom bar */
export const FOOTER_LEGAL_LINKS = [
  { label: 'Terms', to: '/' },
  { label: 'Privacy policy', to: '/' },
  { label: 'Sitemap', to: '/' },
];

/** Footer - social links */
export const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'Pinterest', href: '#' },
  { name: 'Twitter', href: '#' },
];
