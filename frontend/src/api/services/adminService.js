/**
 * Admin API - users, newsletter subscribers
 */
import api from '../axios.js';

export const adminService = {
  getUsers() {
    return api.get('/admin/users').then((res) => res.data.data ?? []);
  },
  deleteUser(id) {
    return api.delete(`/admin/users/${id}`).then((res) => res.data);
  },

  getSubscribers(params = {}) {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.sort) q.set('sort', params.sort);
    if (params.page) q.set('page', params.page);
    if (params.limit) q.set('limit', params.limit);
    const query = q.toString();
    return api.get(`/admin/subscribers${query ? `?${query}` : ''}`).then((res) => res.data);
  },
  deleteSubscriber(id) {
    return api.delete(`/admin/subscribers/${id}`).then((res) => res.data);
  },
};
