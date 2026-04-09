import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// HR endpoints
export const hrAPI = {
  createJobDescription: (title, description, hr_name) =>
    api.post('/hr/job-description', { title, description, hr_name }),
  getJobDescriptions: () =>
    api.get('/hr/job-descriptions'),
  getRankedCandidates: (jobId) =>
    api.get(`/hr/candidates/${jobId}`),
  getDashboard: () =>
    api.get('/hr/dashboard'),
  clearData: () =>
    api.post('/hr/clear-data'),
}

// Candidate endpoints
export const candidateAPI = {
  uploadResume: (jobId, candidateName, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/candidate/upload-resume/${jobId}?candidate_name=${encodeURIComponent(candidateName)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getAvailableJobs: () =>
    api.get('/candidate/jobs'),
  getJobCandidates: (jobId) =>
    api.get(`/candidate/job-candidates/${jobId}`),
}

export default api
