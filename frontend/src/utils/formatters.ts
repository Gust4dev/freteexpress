export function formatCurrencyBRL(value: number | string | undefined): string {
  if (value == null || value === "") return "R$ 0,00";
  const num = typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
  if (Number.isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDateShort(iso?: string | null): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
}

export function clampNumber(n: number, min = 0, max = 100): number {
  if (isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
