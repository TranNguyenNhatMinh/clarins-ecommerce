import { useState, useEffect } from 'react';
import { adminService } from '../../api/services/adminService.js';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const fetchUsers = () => {
    adminService
      .getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id, name) => {
    if (!window.confirm(`Xóa người dùng "${name}"?`)) return;
    adminService
      .deleteUser(id)
      .then(() => {
        setMessage({ text: 'Đã xóa người dùng.', type: 'success' });
        fetchUsers();
      })
      .catch((err) => setMessage({ text: err.response?.data?.message || 'Xóa thất bại.', type: 'error' }));
  };

  const isCurrentUser = (u) => String(u._id) === String(currentUser?.id);

  if (loading) return <LoadingSpinner className="min-h-[320px]" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-admin-text">Quản lý người dùng</h1>
        <p className="mt-1 text-sm text-admin-muted">Danh sách tài khoản và vai trò</p>
      </div>

      <div className="bg-admin-card rounded-admin-lg border border-admin-border shadow-admin overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-admin-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Tên</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Vai trò</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium text-admin-muted uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border bg-admin-card">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-admin-text">{u.name}</td>
                  <td className="px-5 py-4 text-sm text-admin-muted">{u.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-admin-muted'
                      }`}
                    >
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      disabled={isCurrentUser(u)}
                      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="py-12 text-center text-sm text-admin-muted">Chưa có người dùng.</p>
        )}
      </div>

      {message.text && (
        <Toast message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'success' })} />
      )}
    </div>
  );
}
