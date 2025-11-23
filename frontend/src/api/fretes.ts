import api from "./apiClient";
import type { AxiosResponse } from "axios";

export type CreateFreteDTO = {
  origin: { address: string; coords?: [number, number] };
  destination: { address: string; coords?: [number, number] };
  distanceKm: number;
  vehicleType: "moto" | "carro" | "caminhao";
  price: number;
};

export type OrderStatus =
  | "created"
  | "accepted"
  | "in_route"
  | "delivered"
  | "cancelled";

export async function createFrete(
  payload: CreateFreteDTO
): Promise<AxiosResponse> {
  return api.post("/orders", payload);
}

export async function listFretes(page = 1, limit = 20) {
  const res = await api.get(`/orders?page=${page}&limit=${limit}`);
  return res.data;
}

export async function getFrete(id: string) {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}

export async function updateFrete(id: string, payload: Partial<CreateFreteDTO>) {
  return api.patch(`/orders/${id}`, payload);
}

export async function acceptFrete(id: string) {
  const res = await api.post(`/orders/${id}/accept`);
  return res.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data;
}

export default {
  createFrete,
  listFretes,
  getFrete,
  updateFrete,
  acceptFrete,
  updateOrderStatus,
};