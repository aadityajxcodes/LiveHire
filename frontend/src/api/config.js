import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 5000
});

// Add request interceptor to add token
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

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject({ message: 'Request timeout. Please try again.' });
    }
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({ message: 'Network error. Please check your connection and try again.' });
    }
    if (error.response.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if unauthorized
      window.location.href = '/company-login';
    }
    return Promise.reject(error.response.data);
  }
);

export default api; 