import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/services/adminService.js';
import { productService } from '../../api/services/productService.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ROUTES } from '../../constants/index.js';

const StatCard = ({ title, value, href, icon: Icon, accent }) => (
  <Link
    to={href}
    className="group bg-admin-card rounded-admin-lg border border-admin-border p-6 shadow-admin hover:shadow-admin-md transition-all duration-200 hover:border-brand/20"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-admin-muted">{title}</p>
        <p className="mt-2 text-2xl font-bold text-admin-text tracking-tight">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-admin flex items-center justify-center ${accent || 'bg-brand/10 text-brand'}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
    <p className="mt-3 text-xs font-medium text-brand group-hover:underline">Xem chi tiết →</p>
  </Link>
);

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
function ProductIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([adminService.getUsers(), productService.getList()])
      .then(([users, products]) => {
        if (!cancelled) {
          setStats({
            users: Array.isArray(users) ? users.length : 0,
            products: Array.isArray(products) ? products.length : 0,
          });
          setError('');
        }
      })
      .catch(() => {
        if (!cancelled) setError('Không tải được thống kê.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSpinner className="min-h-[320px]" />;
  if (error) {
    return (
      <div className="rounded-admin-lg border border-red-200 bg-red-50/50 p-4 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-admin-text">Dashboard</h1>
        <p className="mt-1 text-sm text-admin-muted">Tổng quan hệ thống và truy cập nhanh</p>
      </div>

      <section>
        <h2 className="text-sm font-medium text-admin-muted uppercase tracking-wider mb-4">Thống kê</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Tổng người dùng"
            value={stats.users}
            href={ROUTES.admin.users}
            icon={UsersIcon}
          />
          <StatCard
            title="Tổng sản phẩm"
            value={stats.products}
            href={ROUTES.admin.products}
            icon={ProductIcon}
          />
          <Link
            to={ROUTES.admin.chat}
            className="group bg-admin-card rounded-admin-lg border border-admin-border p-6 shadow-admin hover:shadow-admin-md transition-all duration-200 hover:border-brand/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-admin-muted">Chat hỗ trợ</p>
                <p className="mt-2 text-lg font-semibold text-admin-text">Quản lý hội thoại</p>
              </div>
              <div className="w-12 h-12 rounded-admin bg-brand/10 text-brand flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-brand group-hover:underline">Mở chat →</p>
          </Link>
        </div>
      </section>

      <section className="bg-admin-card rounded-admin-lg border border-admin-border p-6 shadow-admin">
        <h2 className="text-sm font-medium text-admin-muted uppercase tracking-wider mb-4">Truy cập nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to={ROUTES.admin.products}
            className="flex items-center gap-3 px-4 py-3 rounded-admin border border-admin-border hover:bg-gray-50 hover:border-brand/20 transition-colors text-sm font-medium text-admin-text"
          >
            <ProductIcon className="w-5 h-5 text-brand" />
            Sản phẩm
          </Link>
          <Link
            to={ROUTES.admin.users}
            className="flex items-center gap-3 px-4 py-3 rounded-admin border border-admin-border hover:bg-gray-50 hover:border-brand/20 transition-colors text-sm font-medium text-admin-text"
          >
            <UsersIcon className="w-5 h-5 text-brand" />
            Người dùng
          </Link>
          <Link
            to={ROUTES.admin.subscribers}
            className="flex items-center gap-3 px-4 py-3 rounded-admin border border-admin-border hover:bg-gray-50 hover:border-brand/20 transition-colors text-sm font-medium text-admin-text"
          >
            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Newsletter
          </Link>
          <Link
            to={ROUTES.admin.chat}
            className="flex items-center gap-3 px-4 py-3 rounded-admin border border-admin-border hover:bg-gray-50 hover:border-brand/20 transition-colors text-sm font-medium text-admin-text"
          >
            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            Chat
          </Link>
        </div>
      </section>
    </div>
  );
}