import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;
export const MEDIA_BASE = BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scg_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('scg_admin_token');
      localStorage.removeItem('scg_admin_user');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const mediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${MEDIA_BASE}${path}`;
};

export default api;
