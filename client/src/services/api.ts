import axios from "axios";

export function getApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  const base = fromEnv || "http://localhost:5000";
  return base.replace(/\/$/, "");
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;