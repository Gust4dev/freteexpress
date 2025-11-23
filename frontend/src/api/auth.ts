import api from "./apiClient";

export type UpdateUserDTO = {
  name?: string;
  phone?: string;
  role?: "client" | "driver" | string;
};

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // espera { token, user }
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post("/auth", payload);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function updateMe(payload: UpdateUserDTO) {
  const res = await api.patch("/users/me", payload);
  return res.data;
}

export default { login, register, getMe, updateMe };