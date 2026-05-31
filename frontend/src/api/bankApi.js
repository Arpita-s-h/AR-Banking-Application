import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/arbank';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login if token expires (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ar_token');
      localStorage.removeItem('ar_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser  = (data) => api.post('/auth/register', data);
export const loginUser     = (data) => api.post('/auth/login', data);

// Banking
export const createAccount  = (data) => api.post('/users', data);
export const balanceEnquiry = (accountNumber) => api.get(`/users/balance-enquiry?accountNumber=${accountNumber}`);
export const nameEnquiry    = (accountNumber) => api.get(`/users/name-enquiry?accountNumber=${accountNumber}`);
export const creditAccount  = (data) => api.post('/users/credit', data);
export const debitAccount   = (data) => api.post('/users/debit', data);
export const transferFunds  = (data) => api.post('/users/transfer', data);
export const getBankStatement = (accountNumber, startDate, endDate) =>
  api.get(`/transactions/statement?accountNumber=${accountNumber}&startDate=${startDate}&endDate=${endDate}`);

export default api;