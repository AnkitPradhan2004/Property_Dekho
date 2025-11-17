import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://propertydekho-in.onrender.com",
  withCredentials: true,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Prevent open redirect by using relative path
      if (window.location.pathname !== '/login') {
        window.location.pathname = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
