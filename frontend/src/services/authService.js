import axios from 'axios';

// API_URL sekarang cukup '/api' karena Vercel akan merutekan ini
// dari domain frontend ke serverless functions di folder `api`.
const API_URL = '/api'; // <--- PERBAIKAN DI SINI

export const register = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Pendaftaran gagal. Periksa jaringan atau konfigurasi server.';
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login gagal. Periksa jaringan atau konfigurasi server.';
    }
};

export const logout = () => {
    localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};