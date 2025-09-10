/**
 * PROTÓTIPO: Cálculo do piso ANTT.
 * - Uso: validar se um preço proposto está >= piso obrigatório.
 * - Observação: substituir por integração oficial/atualização automática antes de produção.
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
 * Calcula o piso mínimo (R$) para uma corrida/proposta.
 * Regra protótipo: base fixa + (rate * distanceKm).
 *
 * Exemplo (digit-by-digit demonstrativo):
 *   base = 6
 *   rate = 2.5 (carro)
 *   distanceKm = 10
 *
 *   multiplication = 2.5 * 10 = 25.0
 *   unrounded = base + multiplication = 6 + 25.0 = 31.0
 *   rounded = round(unrounded, 2) = 31.00
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

  // cálculo passo-a-passo
  // multiplication = rate * distanceKm
  const multiplication = Number((rate * distanceKm).toFixed(6));
  // unrounded = base + multiplication
  const unrounded = Number((base + multiplication).toFixed(6));

  // arredondar para 2 casas (centavos)
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

/**
 * Verifica se o preço proposto está >= piso calculado.
 * Retorna { ok, piso } para uso direto em controllers.
 */
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
