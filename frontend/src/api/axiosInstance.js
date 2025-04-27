import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request: Add token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');  // Fix to use 'authToken'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    try {
      // Store the user ID for easy access
      const decoded = jwtDecode(token);
      if (decoded && decoded.id) {
        localStorage.setItem('userId', decoded.id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  return config;
});

// Response: Handle expired or invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
