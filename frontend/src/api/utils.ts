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

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

export type CityOption = {
  value: string;
  label: string;
};

export async function searchCities(
  query: string
): Promise<CityOption[]> {
  if (!query || query.length < 3) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=5&countrycodes=br&featuretype=city,town,village&addressdetails=1`;

    const response = await axios.get<NominatimResult[]>(url, {
      headers: { "User-Agent": "FreteExpressApp/0.1" },
    });

    if (!response.data) return [];

    const options: CityOption[] = response.data
      .map((item) => {
        const city =
          item.address.city || item.address.town || item.address.village;
        const state = item.address.state;
        if (!city || !state) return null;

        const label = `${city}, ${state}`;
        return { value: label, label: label };
      })
      .filter((item): item is CityOption => item !== null);

    const uniqueOptions = Array.from(new Map(options.map(item => [item.label, item])).values());
    
    return uniqueOptions;

  } catch (err) {
    console.error("Falha ao buscar cidades:", err);
    return [];
  }
}