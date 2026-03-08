/**
 * Admin API - users
 */
import api from '../axios.js';

export const adminService = {
  getUsers() {
    return api.get('/admin/users').then((res) => res.data.data ?? []);
  },
  deleteUser(id) {
    return api.delete(`/admin/users/${id}`).then((res) => res.data);
  },
};
