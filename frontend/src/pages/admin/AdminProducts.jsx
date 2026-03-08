import { useState, useEffect } from 'react';
import { productService } from '../../api/services/productService.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';
import ProductForm from '../../components/admin/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [modal, setModal] = useState(null);

  const fetchProducts = () => {
    productService
      .getList()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = (payload) => {
    setLoading(true);
    return productService
      .create(payload)
      .then(() => {
        setMessage({ text: 'Đã tạo sản phẩm.', type: 'success' });
        setModal(null);
        fetchProducts();
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const handleUpdate = (id, payload) => {
    setLoading(true);
    return productService
      .update(id, payload)
      .then(() => {
        setMessage({ text: 'Đã cập nhật.', type: 'success' });
        setModal(null);
        fetchProducts();
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Xóa sản phẩm "${name}"?`)) return;
    setLoading(true);
    productService
      .delete(id)
      .then(() => {
        setMessage({ text: 'Đã xóa sản phẩm.', type: 'success' });
        fetchProducts();
      })
      .catch((err) => {
        setMessage({ text: err.response?.data?.message || 'Xóa thất bại.', type: 'error' });
        setLoading(false);
      });
  };

  if (loading) return <LoadingSpinner className="min-h-[320px]" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-admin-text">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-admin-muted">Thêm, sửa, xóa sản phẩm</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-admin bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors shadow-admin"
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-admin-card rounded-admin-lg border border-admin-border shadow-admin overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-admin-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Ảnh</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Tên</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Giá</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Danh mục</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-admin-muted uppercase tracking-wider">Nổi bật</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium text-admin-muted uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border bg-admin-card">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-4">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-12 h-12 object-cover rounded-admin" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-admin flex items-center justify-center text-admin-muted text-xs">—</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-admin-text">{p.name}</td>
                  <td className="px-5 py-4 text-sm text-admin-muted">{new Intl.NumberFormat('vi-VN').format(p.price)} ₫</td>
                  <td className="px-5 py-4 text-sm text-admin-muted">{p.category || '—'}</td>
                  <td className="px-5 py-4">
                    {p.isBeautyMustHave ? (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand">Có</span>
                    ) : (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-admin-muted">Không</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right space-x-3">
                    <button
                      onClick={() => setModal({ id: p._id, product: p })}
                      className="text-sm font-medium text-brand hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
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
        {products.length === 0 && (
          <p className="py-12 text-center text-sm text-admin-muted">Chưa có sản phẩm.</p>
        )}
      </div>

      {modal === 'create' && (
        <ProductForm onClose={() => setModal(null)} onSubmit={handleCreate} title="Thêm sản phẩm" />
      )}
      {modal?.id && (
        <ProductForm
          initial={modal.product}
          onClose={() => setModal(null)}
          onSubmit={(payload) => handleUpdate(modal.id, payload)}
          title="Chỉnh sửa sản phẩm"
        />
      )}

      {message.text && (
        <Toast message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'success' })} />
      )}
    </div>
  );
}
