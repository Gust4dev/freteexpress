import { Request, Response } from "express";
import { z } from "zod";
import axios from "axios";
import { getHaversineDistance } from "../libs/geolocation";
import { getAddressFromCoords } from "../services/nominatimClient";
import { cacheService } from "../services/cache.service";
import { queueService } from "../services/queue.service";

const distanceSchema = z.object({
  originCoords: z.array(z.number()).length(2),
  destCoords: z.array(z.number()).length(2),
});

const reverseGeocodeSchema = z.object({
  lat: z.string(),
  lon: z.string(),
});

const routeSchema = z.object({
  originCoords: z.array(z.number()).length(2),
  destCoords: z.array(z.number()).length(2),
});

export async function calculateDistance(req: Request, res: Response) {
  try {
    const { originCoords, destCoords } = distanceSchema.parse(req.body);

    const distanceKm = getHaversineDistance(
      originCoords as [number, number],
      destCoords as [number, number]
    );

    return res.json({
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      originCoords,
      destCoords,
    });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: "validation_error", message: "Dados inválidos.", details: err.issues });
    console.error("calculateDistance error", err);
    return res.status(500).json({ error: "internal_error", message: "Erro ao calcular distância." });
  }
}

export async function reverseGeocode(req: Request, res: Response) {
  try {
    const { lat, lon } = reverseGeocodeSchema.parse(req.query);
    const cacheKey = `geo:${lat},${lon}`;

    const cached = cacheService.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Throttled call
    const data = await queueService.schedule(() => getAddressFromCoords(Number(lat), Number(lon)));
    
    const address = data.address;
    const city = address.city || address.town || address.village || "";
    const state = address.state || "";
    const road = address.road || address.suburb || "";
    
    let formattedAddress = data.display_name;
    if (road && city && state) {
      formattedAddress = `${road}, ${city}, ${state}`;
    } else if (city && state) {
      formattedAddress = `${city}, ${state}`;
    } else if (road && state) {
      formattedAddress = `${road}, ${state}`;
    }

    const result = {
      address: formattedAddress,
      fullAddress: data.display_name,
    };

    // TTL: 1 hour (3600 seconds)
    cacheService.set(cacheKey, result, 3600);

    return res.json(result);

  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: "validation_error", message: "Dados inválidos.", details: err.issues });
    console.error("reverseGeocode error", err);
    return res.status(500).json({ error: "internal_error", message: "Erro ao buscar endereço." });
  }
}

export async function getRoute(req: Request, res: Response) {
  try {
    const { originCoords, destCoords } = routeSchema.parse(req.body);
    const cacheKey = `route:${originCoords.join(',')}-${destCoords.join(',')}`;

    const cached = cacheService.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // OSRM expects lon,lat
    const originStr = `${originCoords[1]},${originCoords[0]}`;
    const destStr = `${destCoords[1]},${destCoords[0]}`;

    const url = `http://router.project-osrm.org/route/v1/driving/${originStr};${destStr}?overview=full&geometries=geojson`;

    // Throttled call
    const response = await queueService.schedule(() => axios.get(url));

    if (response.data.code !== "Ok") {
      throw new Error("OSRM API Error");
    }

    const route = response.data.routes[0];
    const result = {
      geometry: route.geometry,
      distance: route.distance,
      duration: route.duration,
    };

    // TTL: 10 minutes (600 seconds)
    cacheService.set(cacheKey, result, 600);

    return res.json(result);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: "validation_error", message: "Dados inválidos.", details: err.issues });
    console.error("getRoute error", err);
    return res.status(500).json({ error: "route_error", message: "Falha ao calcular rota." });
  }
}