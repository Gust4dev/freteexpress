import api from "./apiClient";
import type { AxiosResponse } from "axios";

export type CreateFreteDTO = {
  origem: string;
  destino: string;
  peso: number | string;
  descricao?: string;
  dataColeta?: string;
  tipo?: string;
};

export async function createFrete(payload: CreateFreteDTO): Promise<AxiosResponse> {
  return api.post("/fretes", payload);
}

export async function listFretes(params?: { page?: number; limit?: number }) {
  return api.get("/fretes", { params });
}

export async function getFrete(id: string) {
  return api.get(`/fretes/${id}`);
}

export async function updateFrete(id: string, payload: Partial<CreateFreteDTO>) {
  return api.patch(`/fretes/${id}`, payload);
}

export default { createFrete, listFretes, getFrete, updateFrete };
