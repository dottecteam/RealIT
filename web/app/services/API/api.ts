import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@RealIT:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});