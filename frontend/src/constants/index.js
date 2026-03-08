/**
 * Hằng số dùng chung - dễ đổi brand/ copy sau này
 */
export const APP_NAME = 'ProductHub';

/** Đường dẫn logo header (file đặt trong public/, ví dụ: '/logo.png'). Để '' thì hiển thị chữ APP_NAME */
export const HEADER_LOGO = '/img/header_img/logo.svg';

export const ROUTES = {
  home: '/',
  products: '/products',
  productDetail: (id) => `/products/${id}`,
  login: '/login',
  register: '/register',
  profile: '/profile',
  admin: {
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    users: '/admin/users',
  },
};

/** Menu header - nhóm trái */
export const HEADER_NAV_LEFT = [
  { label: "What's New", to: '/' },
  { label: 'Best Sellers', to: '/products' },
  { label: 'Sản phẩm', to: '/products' },
  { label: 'Quà tặng', to: '/products' },
  { label: 'Khuyến mãi', to: '/' },
];

/** Menu header - nhóm phải */
export const HEADER_NAV_RIGHT = [
  { label: 'Dịch vụ', to: '/' },
  { label: 'Giới thiệu', to: '/' },
];

/** Footer - 4 cột */
export const FOOTER_COLUMNS = [
  {
    title: 'Sản phẩm nổi bật',
    links: [
      { label: 'Sản phẩm mới', to: '/products' },
      { label: 'Bán chạy nhất', to: '/products' },
      { label: 'Danh mục điện tử', to: '/products' },
      { label: 'Danh mục phụ kiện', to: '/products' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Theo dõi đơn hàng', to: '/' },
      { label: 'FAQ', to: '/' },
      { label: 'Chính sách vận chuyển', to: '/' },
      { label: 'Chính sách đổi trả', to: '/' },
      { label: 'Phương thức thanh toán', to: '/' },
      { label: 'Liên hệ', to: '/' },
    ],
  },
  {
    title: 'Dịch vụ',
    links: [
      { label: 'Chương trình khách hàng thân thiết', to: '/' },
      { label: 'Đăng ký nhận thông báo', to: '/' },
      { label: 'Gift Card', to: '/' },
      { label: 'Giới thiệu bạn bè', to: '/' },
      { label: 'Tìm cửa hàng', to: '/' },
    ],
  },
  {
    title: 'Về chúng tôi',
    links: [
      { label: 'Giới thiệu', to: '/' },
      { label: 'Cam kết', to: '/' },
      { label: 'Tuyển dụng', to: '/' },
      { label: 'Chương trình liên kết', to: '/' },
    ],
  },
];

/** Footer - legal links bottom bar */
export const FOOTER_LEGAL_LINKS = [
  { label: 'Điều khoản', to: '/' },
  { label: 'Chính sách bảo mật', to: '/' },
  { label: 'Sitemap', to: '/' },
];

/** Footer - social links (icon = path d cho SVG) */
export const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'Pinterest', href: '#' },
  { name: 'Twitter', href: '#' },
];
