import { Request, Response } from "express";
import { z } from "zod";
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

export async function reverseGeocode(req: Request, res: Response) {
  try {
    const { lat, lon } = reverseGeocodeSchema.parse(req.query);

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

    return res.json({
      address: formattedAddress,
      fullAddress: data.display_name,
    });

  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("reverseGeocode error", err);
    return res.status(500).json({ error: err.message || "internal" });
  }
}