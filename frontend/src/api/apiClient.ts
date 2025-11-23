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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Opcional: emitir evento ou logout global
      sessionStorage.removeItem("fe_auth_token");
    }
    return Promise.reject(err);
  }
);

export default api;
