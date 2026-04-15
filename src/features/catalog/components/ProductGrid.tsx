import { ProductCard } from "./ProductCard";
import type { ProductoListItem } from "../types";

export function ProductGrid({ productos }: { productos: ProductoListItem[] }) {
  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-sm text-neutral-500">
        No encontramos productos con esos filtros.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  );
}
