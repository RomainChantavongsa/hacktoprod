import axios from 'axios';

// Configurazione base URL dell'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Crea istanza axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token JWT a tutte le richieste
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token scaduto o non valido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API per autenticazione
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// API per offerte di trasporto
export const offersAPI = {
  getAll: (params) => api.get('/offers', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  create: (data) => api.post('/offers', data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
};

// API per offerte (bids)
export const bidsAPI = {
  getAll: () => api.get('/bids'),
  create: (offerId, data) => api.post(`/offers/${offerId}/bids`, data),
  update: (id, data) => api.put(`/bids/${id}`, data),
  accept: (id) => api.put(`/bids/${id}`, { status: 'accepted' }),
  reject: (id) => api.put(`/bids/${id}`, { status: 'rejected' }),
};

// API per dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
