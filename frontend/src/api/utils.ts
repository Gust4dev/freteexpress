import api from "./apiClient";

type DistanceResponse = {
  distanceKm: number;
  originCoords: [number, number];
  destCoords: [number, number];
};

export async function calculateDistance(
  origin: string,
  destination: string
): Promise<DistanceResponse> {
  const res = await api.post("/utils/calculate-distance", {
    origin,
    destination,
  });
  return res.data;
}
