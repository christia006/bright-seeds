import axios from 'axios';

// PERBAIKAN PENTING: Ganti placeholder URL backend dengan URL frontend Vercel Anda + /api
// Karena vercel.json merutekan /api ke backend di domain yang sama
const API_URL = import.meta.env.PROD ? 'https://bright-seeds.vercel.app/api' : '/api'; // <--- INI PERBAIKANNYA

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