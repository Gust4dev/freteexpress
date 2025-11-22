import api from "./apiClient";

export type Transaction = {
  _id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: string;
};

export async function getBalance() {
  const res = await api.get("/wallet/balance");
  return res.data;
}

export async function getTransactions() {
  const res = await api.get("/wallet/transactions");
  return res.data;
}

export async function addFunds(amount: number) {
  const res = await api.post("/wallet/add", { amount });
  return res.data;
}
