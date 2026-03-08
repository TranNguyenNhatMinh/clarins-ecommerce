import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../api/services/adminService.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
];

export default function AdminSubscribers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const fetchSubscribers = useCallback(() => {
    setLoading(true);
    adminService
      .getSubscribers({ search, sort, page, limit: 10 })
      .then((res) => {
        setList(Array.isArray(res.data) ? res.data : []);
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      })
      .catch(() => {
        setList([]);
        setPagination({ page: 1, limit: 10, total: 0, totalPages: 1 });
      })
      .finally(() => setLoading(false));
  }, [search, sort, page]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDelete = (id, email) => {
    if (!window.confirm(`Gỡ đăng ký "${email}"?`)) return;
    adminService
      .deleteSubscriber(id)
      .then(() => {
        setMessage({ text: 'Đã gỡ đăng ký.', type: 'success' });
        fetchSubscribers();
      })
      .catch((err) => setMessage({ text: err.response?.data?.message || 'Thất bại.', type: 'error' }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '–';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-admin-text">Newsletter / Subscribers</h1>
        <p className="mt-1 text-sm text-admin-muted">Danh sách email đăng ký nhận tin</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Tìm theo email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 min-w-0 px-4 py-2.5 rounded-admin border border-admin-border text-sm text-admin-text placeholder-admin-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-admin bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors"
          >
            Tìm
          </button>
        </form>
        <div className="flex items-center gap-2">
          <label className="text-sm text-admin-muted">Sắp xếp:</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-admin border border-admin-border text-sm text-admin-text bg-admin-card focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-admin-card rounded-admin-lg border border-admin-border shadow-admin overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-admin-border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Đăng ký lúc</th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Trạng thái</th>
                    <th className="px-5 py-3.5 text-right text-xs font-medium text-admin-muted uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border bg-admin-card">
                  {list.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-admin-text">{s.email}</td>
                      <td className="px-5 py-4 text-sm text-admin-muted">{formatDate(s.subscribedAt)}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {s.status || 'active'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(s._id, s.email)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {list.length === 0 && (
              <p className="py-12 text-center text-sm text-admin-muted">Chưa có subscriber.</p>
            )}

            {pagination.totalPages > 1 && (
              <div className="px-5 py-3 border-t border-admin-border flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-admin-muted">
                  Tổng {pagination.total} · Trang {pagination.page}/{pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-2 rounded-admin border border-admin-border bg-admin-card text-admin-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="px-3 py-2 rounded-admin border border-admin-border bg-admin-card text-admin-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {message.text && (
        <Toast message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'success' })} />
      )}
    </div>
  );
}
