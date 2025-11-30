import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  try {
    const token = sessionStorage.getItem("fe_auth_token");
    if (token && config.headers)
      config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
});

import toast from "react-hot-toast";
import { ApiErrorResponse } from "../types/api";

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const data = err.response?.data as ApiErrorResponse | undefined;

    if (status === 401) {
      // Ignora 401 no login (credenciais inválidas)
      if (err.config.url?.includes("/auth/login")) {
        return Promise.reject(err);
      }

      sessionStorage.removeItem("fe_auth_token");
      
      // Define flag para exibir o toast na landing page
      localStorage.setItem("session_expired", "true");
      
      // Redireciona imediatamente para a landing page
      window.location.href = "/";
      return Promise.reject(err);
    }

    if (status === 429) {
      toast.error("Muitas tentativas. Aguarde um pouco.");
      return Promise.reject(err);
    }

    // Erros genéricos (400, 500, etc)
    // Não exibir toast se for na rota de login (o catch do componente trata)
    if (err.config.url?.includes("/auth/login")) {
      return Promise.reject(err);
    }

    if (data?.message) {
      toast.error(data.message);
    } else if (data?.error) {
       // Fallback se o backend mandar só "error"
      toast.error(data.error);
    } else {
      toast.error("Ocorreu um erro inesperado.");
    }

    return Promise.reject(err);
  }
);

export default api;
