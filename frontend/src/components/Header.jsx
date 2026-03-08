/**
 * Header - 2 hàng: search + logo + icons, nav links
 * Dựa trên thiết kế Clarins-style, tách config từ constants
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  APP_NAME,
  ROUTES,
  HEADER_LOGO,
  HEADER_NAV_LEFT,
  HEADER_NAV_RIGHT,
} from '../constants/index.js';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home);
    setUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.products}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      navigate(ROUTES.products);
    }
    setMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Hàng 1: Search | Logo | Icons */}
      <div className="max-w-[88rem] mx-auto px-2 sm:px-3 lg:px-3.5">
        <div className="flex items-center h-16 md:h-[72px]">
          {/* Trái: search - chiếm 1 phần bằng với bên phải để logo giữa thật */}
          <div className="flex-1 flex items-center justify-start min-w-0 pr-2">
            <form onSubmit={handleSearch} className="w-full max-w-[280px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 text-sm text-gray-800 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition"
                aria-label="Tìm kiếm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            </form>
          </div>

          {/* Giữa: logo cố định ở giữa */}
          <Link
            to={ROUTES.home}
            className="flex-shrink-0 flex items-center justify-center h-11 md:h-12 min-w-[140px] px-4"
          >
            {HEADER_LOGO ? (
              <img
                src={HEADER_LOGO}
                alt={APP_NAME}
                className="h-full w-auto max-h-12 object-contain object-center"
              />
            ) : (
              <span className="px-5 py-2.5 bg-brand text-white font-semibold text-base md:text-lg tracking-[0.2em] uppercase hover:bg-brand-600 transition">
                {APP_NAME}
              </span>
            )}
          </Link>

          {/* Phải: icons - chiếm 1 phần bằng bên trái */}
          <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3 min-w-0 pl-2">
            {/* User icon */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2.5 text-gray-600 hover:text-gray-900 transition relative"
                aria-label="Tài khoản"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" aria-hidden />
                )}
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 mt-1 w-48 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                    {user ? (
                      <>
                        <p className="px-4 py-2 text-sm text-gray-600 truncate">{user.name}</p>
                        <Link
                          to={ROUTES.profile}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Hồ sơ
                        </Link>
                        {isAdmin && (
                          <Link
                            to={ROUTES.admin.dashboard}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Admin
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={ROUTES.login}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          to={ROUTES.register}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to={ROUTES.products}
              className="p-2.5 text-gray-600 hover:text-gray-900 transition"
              aria-label="Yêu thích"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.products}
              className="p-2.5 text-gray-600 hover:text-gray-900 transition"
              aria-label="Giỏ hàng"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2.5 text-gray-600 hover:text-gray-900"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Hàng 2: Nav - nhóm trái & nhóm phải, đường kẻ dưới */}
        <nav className="hidden md:flex items-center justify-between py-4 border-t border-gray-200">
          <div className="flex items-center gap-6 lg:gap-8">
            {HEADER_NAV_LEFT.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs font-medium text-gray-600 hover:text-brand uppercase tracking-[0.12em] transition py-1 border-b border-transparent hover:border-brand"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6 lg:gap-8">
            {HEADER_NAV_RIGHT.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs font-medium text-gray-600 hover:text-brand uppercase tracking-[0.12em] transition py-1 border-b border-transparent hover:border-brand"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 space-y-1">
            {[...HEADER_NAV_LEFT, ...HEADER_NAV_RIGHT].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block py-2.5 text-sm text-gray-600 hover:text-gray-900 uppercase tracking-wide"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
