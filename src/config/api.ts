export const API_BASE_URL = 'https://hackathon-backend-h5uq.onrender.com/api/public';

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  forgotPassword: `${API_BASE_URL}/forgot-password`,
} as const; 