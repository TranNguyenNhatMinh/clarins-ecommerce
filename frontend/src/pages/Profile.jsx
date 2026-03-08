import { useState, useEffect } from 'react';
import { userService } from '../api/services/userService.js';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  useEffect(() => {
    let cancelled = false;
    userService
      .getProfile()
      .then((u) => {
        if (!cancelled && u) setName(u.name || '');
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setFetchLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });
    try {
      const data = await userService.updateProfile({ name });
      updateUser(data.data);
      setMessage({ text: 'Cập nhật thành công!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Cập nhật thất bại.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner className="min-h-[40vh]" />;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ cá nhân</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
            <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi.</p>
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-sm bg-gray-100 text-gray-600">{user?.role === 'admin' ? 'Admin' : 'User'}</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Cập nhật'}
          </button>
        </form>
      </div>
      {message.text && <Toast message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'success' })} />}
    </div>
  );
}
