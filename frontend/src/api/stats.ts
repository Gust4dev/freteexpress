import api from "./apiClient";

export type EarningsHistoryItem = {
  date: string;
  value: number;
};

export type Achievement = {
  title: string;
  progress: number;
  icon: string;
};

export type DriverStats = {
  earningsHistory: EarningsHistoryItem[];
  totalEarnings7Days: number;
  rating: number;
  totalOrders: number;
  achievements: Achievement[];
};

export async function getDriverStats(): Promise<DriverStats> {
  const res = await api.get("/stats/driver");
  return res.data;
}
