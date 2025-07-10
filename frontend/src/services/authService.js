// brightseeds-app/frontend/src/services/authService.js
import axios from 'axios';

// PERBAIKAN KRITIS: API_URL harus menunjuk ke jalur relatif /api
// Karena Vercel akan merutekan semua permintaan ke /api/* ke serverless functions Anda.
const API_URL = '/api'; 

export const register = async (username, password) => {
    try {
        // Axios otomatis menangani JSON stringify dan Content-Type header
        const response = await axios.post(`${API_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        // Menggunakan optional chaining (?) untuk mencegah 'Cannot read properties of undefined (reading 'data')'
        // Jika 'error.response' adalah undefined (misal: karena CORS memblokir *preflight*),
        // maka akan langsung menggunakan pesan default.
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