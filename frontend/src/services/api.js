import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const jobsAPI = {
  getAll: (sortBy) => api.get('/jobs', { params: { sortBy } }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  search: (keyword, sortBy) => api.get('/jobs/search', { params: { keyword, sortBy } }),
  filterByStatus: (status, sortBy) => api.get(`/jobs/status/${status}`, { params: { sortBy } }),
  getStats: () => api.get('/jobs/stats'),
};

export const interviewsAPI = {
  getByJob: (jobId) => api.get(`/jobs/${jobId}/interviews`),
  create: (jobId, data) => api.post(`/jobs/${jobId}/interviews`, data),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
};

export default api;
