import axios from 'axios';
import { getCurrentUser } from './authService';

// PERBAIKAN PENTING: Ganti placeholder URL backend dengan URL frontend Vercel Anda + /api
// Karena vercel.json merutekan /api ke backend di domain yang sama
const API_URL = import.meta.env.PROD ? 'https://bright-seeds.vercel.app/api' : '/api'; // <--- INI PERBAIKANNYA

export const fetchUserProfile = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/users/${username}`);
        return response.data.user;
    } catch (error) {
        throw error.response.data.message || 'Failed to fetch user profile.';
    }
};

export const updateUserProgess = async (username, progressData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${username}/progress`, { progress: progressData });
        // Update local storage with new user data including progress
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data.user;
    } catch (error) {
        throw error.response.data.message || 'Failed to update user progress.';
    }
};