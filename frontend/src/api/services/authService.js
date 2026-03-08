/**
 * Auth API - đăng ký, đăng nhập
 */
import api from '../axios.js';

export const authService = {
  login(email, password) {
    return api.post('/auth/login', { email, password }).then((res) => res.data);
  },
  register(name, email, password) {
    return api.post('/auth/register', { name, email, password }).then((res) => res.data);
  },
};
