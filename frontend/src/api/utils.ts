import api from "./apiClient";

type Coords = [number, number];

type DistanceResponse = {
  distanceKm: number;
  originCoords: Coords;
  destCoords: Coords;
};

export async function calculateDistance(
  originCoords: Coords,
  destCoords: Coords
): Promise<DistanceResponse> {
  const res = await api.post("/utils/calculate-distance", {
    originCoords,
    destCoords,
  });
  return res.data;
}

type ReverseGeocodeResponse = {
  address: string;
  fullAddress: string;
};

export async function reverseGeocode(
  coords: Coords
): Promise<ReverseGeocodeResponse> {
  const res = await api.get<ReverseGeocodeResponse>("/utils/reverse-geocode", {
    params: {
      lat: coords[0],
      lon: coords[1],
    },
  });
  return res.data;
}

export async function fetchRoutePath(
  originCoords: Coords,
  destCoords: Coords
): Promise<any> {
  const res = await api.post("/utils/route", {
    originCoords,
    destCoords,
  });
  return res.data;
}