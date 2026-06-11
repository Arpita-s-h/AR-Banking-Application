import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/arbank';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ar_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
export const registerAdmin = (data) => api.post('/auth/register-admin', data);
export const loginUser     = (data) => api.post('/auth/login', data);

// Profile
export const getProfile    = ()     => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// Banking
export const balanceEnquiry   = (accountNumber) => api.get(`/users/balance-enquiry?accountNumber=${accountNumber}`);
export const nameEnquiry      = (accountNumber) => api.get(`/users/name-enquiry?accountNumber=${accountNumber}`);
export const creditAccount    = (data) => api.post('/users/credit', data);
export const debitAccount     = (data) => api.post('/users/debit', data);
export const transferFunds    = (data) => api.post('/users/transfer', data);
export const getBankStatement = (accountNumber, startDate, endDate) =>
  api.get(`/transactions/statement?accountNumber=${accountNumber}&startDate=${startDate}&endDate=${endDate}`);

// Admin
export const getAdminStats       = ()              => api.get('/admin/stats');
export const getAllUsers          = ()              => api.get('/admin/users');
export const searchUser          = (accountNumber) => api.get(`/admin/users/search?accountNumber=${accountNumber}`);
export const blockUser           = (accountNumber) => api.put(`/admin/users/${accountNumber}/block`);
export const unblockUser         = (accountNumber) => api.put(`/admin/users/${accountNumber}/unblock`);
export const deleteUser          = (accountNumber) => api.delete(`/admin/users/${accountNumber}`);
export const getAllTransactions   = ()              => api.get('/admin/transactions');

export default api;