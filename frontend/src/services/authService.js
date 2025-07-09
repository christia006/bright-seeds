import axios from 'axios';

// IMPORTANT: Replace with your deployed backend URL for production
// For local development with Vite proxy, use '/api'
const API_URL = import.meta.env.PROD ? 'https://your-brightseeds-backend-url.vercel.app/api' : '/api';

export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Registration failed.';
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Login failed.';
  }
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};