import api from "./apiClient";

export type Rating = {
  _id: string;
  orderId: string;
  score: number;
  comment?: string;
};

export async function createRating(orderId: string, score: number, comment?: string) {
  const res = await api.post("/ratings", { orderId, score, comment });
  return res.data;
}

export async function getRatingsByOrder(orderId: string) {
  const res = await api.get(`/ratings/order/${orderId}`);
  return res.data;
}
