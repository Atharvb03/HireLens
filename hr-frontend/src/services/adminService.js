import api from './api';

export const adminService = {
  signup: async (data) => {
    const response = await api.post('/admin/signup', data);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  }
};
