import api from './api';

export const candidateService = {
  getRankedCandidates: async (params = {}) => {
    const response = await api.get('/candidates/ranking', { params });
    return response.data;
  },
  
  createCandidate: async (data) => {
    const response = await api.post('/candidates', data);
    return response.data;
  },
  
  updateScores: async (id, scores) => {
    const response = await api.put(`/candidates/${id}/scores`, scores);
    return response.data;
  }
};
