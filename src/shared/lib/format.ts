const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export function formatPrice(value: string | number | null | undefined): string {
  if (value == null) return "";
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "";
  return MXN.format(n);
}
