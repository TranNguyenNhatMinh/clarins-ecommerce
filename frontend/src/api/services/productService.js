/**
 * Product API - tách gọi API khỏi UI, dễ thay đổi/ test
 */
import api from '../axios.js';

export const productService = {
  getList() {
    return api.get('/products').then((res) => res.data.data ?? []);
  },
  getById(id) {
    return api.get(`/products/${id}`).then((res) => res.data.data);
  },
  create(payload) {
    return api.post('/products', payload).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/products/${id}`, payload).then((res) => res.data);
  },
  delete(id) {
    return api.delete(`/products/${id}`).then((res) => res.data);
  },
};
