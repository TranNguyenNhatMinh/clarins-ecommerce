/**
 * Product API - tách gọi API khỏi UI, dễ thay đổi/ test
 */
import api from '../axios.js';

export const productService = {
  /**
   * @param {{ category?: string, beautyMustHave?: boolean }} params - category: face|makeup|body|men; beautyMustHave: true for Beauty Must Have section
   */
  getList(params = {}) {
    const q = new URLSearchParams();
    if (params.category) q.set('category', params.category);
    if (params.beautyMustHave === true) q.set('beautyMustHave', 'true');
    const query = q.toString();
    return api.get(`/products${query ? `?${query}` : ''}`).then((res) => res.data.data ?? []);
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
