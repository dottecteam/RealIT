import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../constants/keys";
import { ROUTES } from "../../constants/routes";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para anexar o token automaticamente antes de enviar a requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para capturar erros globais (Ex: se o backend retornar 401, desloga na hora)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (typeof window !== "undefined") {
        window.location.href = ROUTES.AUTH.LOGIN.href;
      }
    }
    return Promise.reject(error);
  }
);