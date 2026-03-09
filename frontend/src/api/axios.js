/**
 * Axios instance - gắn token và xử lý lỗi chung
 * 401: gọi logout (authRef) rồi navigate SPA về /login, không reload trang
 */
import axios from 'axios';
import { authRef, navigateRef } from './navigateRef.js';

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: baseURL ? `${baseURL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Gắn token (trong bộ nhớ) vào mọi request
api.interceptors.request.use((config) => {
  const token = authRef.current?.getToken?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý 401 (token hết hạn / không hợp lệ) - SPA redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      authRef.current?.logout?.();
      if (navigateRef.current) {
        navigateRef.current('/login');
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
