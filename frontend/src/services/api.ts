import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; limit?: number; skip?: number }) =>
    api.get('/products', { params }),
  
  getById: (id: string) =>
    api.get(`/products/${id}`),
  
  create: (data: {
    name: string;
    description: string;
    category: string;
    manufacturer?: string;
    manufacturingLocation?: string;
    materials?: string[];
    supplyChainInfo?: string;
  }) =>
    api.post('/products', data),
  
  update: (id: string, data: any) =>
    api.put(`/products/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/products/${id}`),
};

// Analysis API
export const analysisAPI = {
  analyze: (productId: string) =>
    api.post(`/analysis/analyze/${productId}`),
  
  getById: (analysisId: string) =>
    api.get(`/analysis/${analysisId}`),
  
  getHistory: (params?: { limit?: number; skip?: number }) =>
    api.get('/analysis/user/history', { params }),
};

export default api;
