import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Removed authentication interceptor for demo mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
