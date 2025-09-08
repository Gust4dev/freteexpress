/**
 * Protótipo: regra local para piso ANTT.
 * Em produção: substituir por integração oficial/atualização automática.
 */
export function calcPisoMinimo(distanceKm: number, vehicleType: string): number {
  const base = 6;
  const rate = vehicleType === moto ? 1.2 : 2.5;
  const val = base + rate * distanceKm;
  return Math.round(val * 100) / 100;
}
