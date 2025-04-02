import axios from "axios";

const API_URL = "http://localhost:5000/api"; // URL base do backend

export const api = axios.create({
  baseURL: API_URL,
});

// Exemplo de interceptor para incluir token JWT
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
