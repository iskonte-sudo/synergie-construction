import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('scg_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  });
  const [loading, setLoading] = useState(true);

  const verify = useCallback(async () => {
    const token = localStorage.getItem('scg_admin_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      localStorage.setItem('scg_admin_user', JSON.stringify(data));
    } catch (_) {
      setUser(null);
      localStorage.removeItem('scg_admin_token');
      localStorage.removeItem('scg_admin_user');
    }
    setLoading(false);
  }, []);

  useEffect(() => { verify(); }, [verify]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('scg_admin_token', data.access_token);
    localStorage.setItem('scg_admin_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('scg_admin_token');
    localStorage.removeItem('scg_admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh: verify }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
