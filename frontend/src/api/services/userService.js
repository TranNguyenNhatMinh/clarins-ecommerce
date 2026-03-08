/**
 * User API - profile
 */
import api from '../axios.js';

export const userService = {
  getProfile() {
    return api.get('/users/profile').then((res) => res.data.data);
  },
  updateProfile(payload) {
    return api.put('/users/profile', payload).then((res) => res.data);
  },
};
