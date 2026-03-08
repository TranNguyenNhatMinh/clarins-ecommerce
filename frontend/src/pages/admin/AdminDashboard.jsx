import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/services/adminService.js';
import { productService } from '../../api/services/productService.js';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ROUTES } from '../../constants/index.js';

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

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to={ROUTES.admin.users} className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Tổng số user</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.users}</p>
        </Link>
        <Link to={ROUTES.admin.products} className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Tổng số sản phẩm</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.products}</p>
        </Link>
      </div>
    </div>
  );
}
