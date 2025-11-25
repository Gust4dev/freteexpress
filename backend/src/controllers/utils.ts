import { Request, Response } from "express";
import { z } from "zod";
import axios from "axios";
import { getHaversineDistance } from "../libs/geolocation";
import { getAddressFromCoords } from "../services/nominatimClient";

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
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("calculateDistance error", err);
    return res.status(500).json({ error: "internal" });
  }
}

const geocodeCache = new Map<string, any>();
const routeCache = new Map<string, any>();

export async function reverseGeocode(req: Request, res: Response) {
  try {
    const { lat, lon } = reverseGeocodeSchema.parse(req.query);
    const cacheKey = `${lat},${lon}`;

    if (geocodeCache.has(cacheKey)) {
      return res.json(geocodeCache.get(cacheKey));
    }

    const data = await getAddressFromCoords(Number(lat), Number(lon));
    
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

    geocodeCache.set(cacheKey, result);
    if (geocodeCache.size > 1000) geocodeCache.clear();

    return res.json(result);

  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("reverseGeocode error", err);
    return res.status(500).json({ error: err.message || "internal" });
  }
}

export async function getRoute(req: Request, res: Response) {
  try {
    const { originCoords, destCoords } = routeSchema.parse(req.body);
    const cacheKey = `${originCoords.join(',')}-${destCoords.join(',')}`;

    if (routeCache.has(cacheKey)) {
      return res.json(routeCache.get(cacheKey));
    }

    // OSRM espera lon,lat
    const originStr = `${originCoords[1]},${originCoords[0]}`;
    const destStr = `${destCoords[1]},${destCoords[0]}`;

    const url = `http://router.project-osrm.org/route/v1/driving/${originStr};${destStr}?overview=full&geometries=geojson`;

    const response = await axios.get(url);

    if (response.data.code !== "Ok") {
      throw new Error("OSRM API Error");
    }

    const route = response.data.routes[0];
    const result = {
      geometry: route.geometry,
      distance: route.distance,
      duration: route.duration,
    };

    routeCache.set(cacheKey, result);
    if (routeCache.size > 500) routeCache.clear();

    return res.json(result);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("getRoute error", err);
    return res.status(500).json({ error: "Failed to fetch route" });
  }
}