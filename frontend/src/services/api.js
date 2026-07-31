import axios from 'axios';

// Absolute Production Base URL: Force live deployment URL to real-estate-portal-vu1r.onrender.com
const getBaseURL = () => {
  // If running live on Vercel/Netlify/production browser, use live backend URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://real-estate-portal-vu1r.onrender.com/api';
  }
  return import.meta.env.VITE_API_URL || 'https://real-estate-portal-vu1r.onrender.com';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 35000, // 35s timeout to handle Render cold start
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
