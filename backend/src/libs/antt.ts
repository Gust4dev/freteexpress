/**
 * Protótipo do cálculo da ANTT.
 * Valida se o preço tá acima do piso.
 * Em prod tem que integrar com a API oficial.
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
 * Calcula o piso mínimo.
 * Regra simples: base + (taxa * km).
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

  // Passo a passo
  const multiplication = Number((rate * distanceKm).toFixed(6));
  const unrounded = Number((base + multiplication).toFixed(6));

  // Arredonda pra 2 casas
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

// Vê se o preço tá ok com o piso
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
