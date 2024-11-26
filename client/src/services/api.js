import axios from 'axios';
require('dotenv').config();

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL) || 'http://localhost:5000/'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;