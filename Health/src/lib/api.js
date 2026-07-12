import axios from 'axios';
import useAuthStore from '../store/useAuthstore.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const publicUrls = [
    "/api/auth/login",
    "/api/auth/register/patient",
  ];

  if (!publicUrls.includes(config.url)) {
    const token =
      useAuthStore.getState().token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;

