import { useState, useEffect } from 'react';
import { productService } from '../../api/services/productService.js';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import ProductForm from '../../components/admin/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [modal, setModal] = useState(null); // null | 'create' | { id: 'edit', product }

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
    return productService.create(payload).then(() => {
      setMessage({ text: 'Tạo sản phẩm thành công.', type: 'success' });
      setModal(null);
      fetchProducts();
    });
  };

  const handleUpdate = (id, payload) => {
    return productService.update(id, payload).then(() => {
      setMessage({ text: 'Cập nhật thành công.', type: 'success' });
      setModal(null);
      fetchProducts();
    });
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
    productService
      .delete(id)
      .then(() => {
        setMessage({ text: 'Đã xóa sản phẩm.', type: 'success' });
        fetchProducts();
      })
      .catch((err) => setMessage({ text: err.response?.data?.message || 'Xóa thất bại.', type: 'error' }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
        <button
          onClick={() => setModal('create')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Intl.NumberFormat('vi-VN').format(p.price)} ₫</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => setModal({ id: p._id, product: p })} className="text-primary-600 hover:underline text-sm">Sửa</button>
                    <button onClick={() => handleDelete(p._id, p.name)} className="text-red-600 hover:underline text-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <p className="p-6 text-center text-gray-500">Chưa có sản phẩm nào.</p>}
      </div>

      {modal === 'create' && (
        <ProductForm
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
          title="Thêm sản phẩm"
        />
      )}
      {modal?.id && (
        <ProductForm
          initial={modal.product}
          onClose={() => setModal(null)}
          onSubmit={(payload) => handleUpdate(modal.id, payload)}
          title="Sửa sản phẩm"
        />
      )}

      {message.text && <Toast message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'success' })} />}
    </div>
  );
}
