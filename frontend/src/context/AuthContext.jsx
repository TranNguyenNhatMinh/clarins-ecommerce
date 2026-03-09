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
  const [token, setToken] = useState(null);
  const [loading] = useState(false);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    authRef.current = {
      logout,
      getToken: () => token,
    };
    return () => { authRef.current = null; };
  }, [logout, token]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const { user: u, token } = data.data;
    setUser(u);
    setToken(token);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const data = await authService.register(name, email, password, phone);
    const { user: u, token } = data.data;
    // Tự động đăng nhập sau khi đăng ký thành công (lưu trong state, không persist)
    setUser(u);
    setToken(token);
    return data;
  };

  const updateUser = (updated) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const value = {
    user,
    token,
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
