import api from './api';

export const jobService = {
  getAll: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  
  create: async (jobData) => {
    const response = await api.post('/jobs/create', jobData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};
