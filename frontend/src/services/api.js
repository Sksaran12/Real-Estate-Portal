import axios from 'axios';

// Smart Base URL: Use env variable, or if running on Vercel/cloud, fallback to deployed backend, else localhost
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Check if browser is on live deployment (Vercel/Netlify)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://real-estate-portal-backend.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30s timeout to allow Render free instance to spin up
});

// Interceptor to attach Authorization header if token exists
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error('Error parsing token from storage:', e);
    }
  }
  return config;
});

export default API;
