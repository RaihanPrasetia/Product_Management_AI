import axios from 'axios';

// Base API URL
const API_URL = `${
  import.meta.env.VITE_API_URL ?? 'http://localhost:9000'
}/api`;

const API_KEY = import.meta.env.VITE_API_KEY;

// Create a reusable Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
