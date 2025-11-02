import api from "./apiClient";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // expect { token, user }
}

export async function register(payload: { name: string; email: string; password: string }) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/users/me");
  return res.data;
}

export default { login, register, getMe };
