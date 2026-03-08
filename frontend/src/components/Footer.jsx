/**
 * Footer - Newsletter + 4 cột + bottom bar
 * Dựa trên thiết kế Clarins-style, config từ constants
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, FOOTER_COLUMNS, FOOTER_LEGAL_LINKS, SOCIAL_LINKS } from '../constants/index.js';

const SocialIcon = ({ name }) => {
  const icons = {
    Facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    YouTube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    Pinterest: 'M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z',
    Twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  };
  const path = icons[name] || '';
  return path ? (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  ) : null;
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-50 text-gray-700 mt-auto">
      {/* Newsletter - upper footer */}
      <section className="max-w-[88rem] mx-auto px-2 sm:px-3 lg:px-3.5 py-14 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 tracking-wide">Đăng ký nhận bản tin</h3>
        <p className="text-sm text-gray-500 mb-6">Giảm 10% cho đơn hàng đầu tiên</p>
        <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Nhập địa chỉ email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribed}
            className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-100 text-sm"
          />
          <button
            type="submit"
            disabled={subscribed}
            className="px-8 py-3 bg-brand text-white text-sm font-medium tracking-widest uppercase hover:bg-brand-600 transition disabled:opacity-70 disabled:cursor-not-allowed rounded-sm"
          >
            {subscribed ? 'Đã đăng ký' : 'Đăng ký'}
          </button>
        </form>
      </section>

      {/* 4 cột link */}
      <div className="max-w-[88rem] mx-auto px-2 sm:px-3 lg:px-3.5 py-14 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-gray-800 mb-4 uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-gray-900 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="mt-12">
          <div className="flex justify-center lg:justify-start gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-brand transition"
                aria-label={s.name}
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar - copyright + legal + region */}
      <div className="border-t border-gray-200 bg-stone-50">
        <div className="max-w-[88rem] mx-auto px-2 sm:px-3 lg:px-3.5 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {FOOTER_LEGAL_LINKS.map((link) => (
                  <Link key={link.label} to={link.to} className="hover:text-gray-800 transition">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Khu vực:</span>
              <span className="text-gray-700">Việt Nam (Tiếng Việt)</span>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-brand" />
      </div>
    </footer>
  );
}
