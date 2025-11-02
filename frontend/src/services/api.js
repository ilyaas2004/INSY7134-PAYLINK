import axios from 'axios';

// Base URL for API
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5000/api';

// Create axios instance for customer
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for employee
const employeeApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to customer requests if it exists
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

// Add token to employee requests if it exists
employeeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('employeeToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally for customer
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Handle response errors globally for employee
employeeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employee');
      window.location.href = '/employee/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user data' };
    }
  }
};

// Payment API calls
export const paymentAPI = {
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment creation failed' };
    }
  },
  
  getUserPayments: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payments' };
    }
  },
  
  getPayment: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment' };
    }
  }
};

// Employee API calls
export const employeeAPI = {
  login: async (credentials) => {
    try {
      const response = await employeeApi.post('/employee/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
  
  getMe: async () => {
    try {
      const response = await employeeApi.get('/employee/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employee data' };
    }
  },
  
  getAllPayments: async (status = '') => {
    try {
      const url = status ? `/employee/payments?status=${status}` : '/employee/payments';
      const response = await employeeApi.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payments' };
    }
  },
  
  getPendingPayments: async () => {
    try {
      const response = await employeeApi.get('/employee/payments/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending payments' };
    }
  },
  
  verifyPayment: async (paymentId) => {
    try {
      const response = await employeeApi.put(`/employee/payments/${paymentId}/verify`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify payment' };
    }
  },
  
  rejectPayment: async (paymentId, reason) => {
    try {
      const response = await employeeApi.put(`/employee/payments/${paymentId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject payment' };
    }
  },
  
  submitToSwift: async (paymentIds) => {
    try {
      const response = await employeeApi.post('/employee/payments/submit-to-swift', { paymentIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit to SWIFT' };
    }
  },
  
  getStatistics: async () => {
    try {
      const response = await employeeApi.get('/employee/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  }
};

export default api;