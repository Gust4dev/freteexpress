/**
 * Cálculo de piso da ANTT
 */

export type VehicleType = "moto" | "carro" | "caminhao";

interface CalcResult {
  piso: number;
  details: {
    base: number;
    rate: number;
    multiplication: number;
    unrounded: number;
    rounded: number;
  };
}

/**
 * Calcula piso mínimo
 */
export function calcPisoMinimo(
  distanceKm: number,
  vehicleType: VehicleType
): CalcResult {
  if (distanceKm < 0) throw new Error("distanceKm must be >= 0");

  const base = 6.0;

  const rateMap: Record<VehicleType, number> = {
    moto: 1.2,
    carro: 2.5,
    caminhao: 5.0,
  };

  const rate = rateMap[vehicleType];

  // Cálculo detalhado
  const multiplication = Number((rate * distanceKm).toFixed(6));
  const unrounded = Number((base + multiplication).toFixed(6));

  // Arredonda (2 casas)
  const rounded = Math.round(unrounded * 100) / 100;

  return {
    piso: rounded,
    details: {
      base,
      rate,
      multiplication,
      unrounded,
      rounded,
    },
  };
}

// Valida preço vs piso
export function validatePriceAgainstPiso(
  price: number,
  distanceKm: number,
  vehicleType: VehicleType
) {
  const { piso } = calcPisoMinimo(distanceKm, vehicleType);
  return {
    ok: price >= piso,
    piso,
  };
}
