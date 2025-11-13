import api from "./apiClient";
import axios from "axios";

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

export type CityOption = {
  value: string;
  label: string;
};

export async function searchCities(
  query: string
): Promise<CityOption[]> {
  if (!query || query.length < 3) return [];
  try {
    const res = await api.get<CityOption[]>("/utils/search-cities", {
      params: { q: query },
    });
    
    return res.data.map(option => {
      const parts = option.label.split(',');
      if (parts.length > 2) {
        const city = parts[0];
        const state = parts.find(p => p.trim().length === 2 && p.trim() !== 'SP'); // Heurística simples
        if (state) {
          return { value: `${city}, ${state.trim()}`, label: `${city}, ${state.trim()}` };
        }
        return { value: `${parts[0]}, ${parts[1]}`, label: `${parts[0]}, ${parts[1]}`};
      }
      return option;
    });

  } catch (err) {
    console.error("Falha ao buscar cidades:", err);
    return [];
  }
}