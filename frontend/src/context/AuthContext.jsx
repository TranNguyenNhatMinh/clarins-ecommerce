/**
 * Auth context - lưu user, token; cung cấp login, logout, register
 * Gọi authService để tách lớp API khỏi UI
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services/authService.js';
import { authRef } from '../api/navigateRef.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    authRef.current = { logout };
    return () => { authRef.current = null; };
  }, []);

  // Khôi phục đăng nhập từ localStorage khi refresh trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && (u.id || u._id)) setUser(u);
      } catch (_) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const { user: u, token } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    const { user: u, token } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return data;
  };

  const updateUser = (updated) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      localStorage.setItem('user', JSON.stringify({ ...parsed, ...updated }));
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
