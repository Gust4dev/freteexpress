import { Request, Response } from "express";
import { z } from "zod";
import axios from "axios";
import { getHaversineDistance } from "../libs/geolocation";

const distanceSchema = z.object({
  origin: z.string().min(3, "Origem é obrigatória"),
  destination: z.string().min(3, "Destino é obrigatório"),
});

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

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1&countrycodes=br&addressdetails=1`;

    const response = await axios.get<NominatimResult[]>(url, {
      headers: { "User-Agent": "FreteExpressApp/0.1" },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return [parseFloat(lat), parseFloat(lon)];
    }
    return null;
  } catch (err) {
    console.error(`Falha na geocodificação: ${address}`, err);
    return null;
  }
}

export async function calculateDistance(req: Request, res: Response) {
  try {
    const { origin, destination } = distanceSchema.parse(req.body);

    const [originCoords, destCoords] = await Promise.all([
      geocodeAddress(origin),
      geocodeAddress(destination),
    ]);

    if (!originCoords || !destCoords) {
      return res.status(400).json({ error: "geocode_failed" });
    }

    const distanceKm = getHaversineDistance(originCoords, destCoords);

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

export async function searchCities(req: Request, res: Response) {
  try {
    const query = z.string().min(3).parse(req.query.q);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=5&countrycodes=br&addressdetails=1`;

    const response = await axios.get<NominatimResult[]>(url, {
      headers: { "User-Agent": "FreteExpressApp/0.1" },
    });

    if (!response.data) return res.json([]);

    const options = response.data
      .map((item) => {
        const city =
          item.address.city || item.address.town || item.address.village;
        const state = item.address.state;
        
        const label = item.display_name;
        const value = label;

        if (city && state) {
          return { value: `${city}, ${state}`, label: `${city}, ${state}` };
        }
        
        return { value: label, label: label };
      })
      .filter((item): item is { value: string, label: string } => item !== null);
    
    const uniqueOptions = Array.from(new Map(options.map(item => [item.label, item])).values());
    
    return res.json(uniqueOptions);

  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("searchCities error", err);
    return res.status(500).json({ error: "internal" });
  }
}