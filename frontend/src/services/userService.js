import axios from 'axios';
// import { getCurrentUser } from './authService'; // Ini tidak diperlukan di sini

// API_URL sekarang cukup '/api'
const API_URL = '/api'; // <--- PERBAIKAN DI SINI

export const fetchUserProfile = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/users/${username}`);
        return response.data.user;
    } catch (error) {
        throw error.response?.data?.message || 'Gagal mengambil profil pengguna. Periksa jaringan atau konfigurasi server.';
    }
};

export const updateUserProgess = async (username, progressData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${username}/progress`, { progress: progressData });
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data.user;
    } catch (error) {
        throw error.response?.data?.message || 'Gagal memperbarui progres pengguna. Periksa jaringan atau konfigurasi server.';
    }
};