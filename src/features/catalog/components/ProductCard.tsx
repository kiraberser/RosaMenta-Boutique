import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@shared/lib/format";
import { productoHref } from "@shared/lib/slug";

import type { ProductoListItem } from "../types";

export function ProductCard({ producto }: { producto: ProductoListItem }) {
  const hasDiscount =
    producto.precio_descuento != null &&
    Number(producto.precio_descuento) < Number(producto.precio);

  return (
    <Link
      href={productoHref({ id: producto.id, categoria: producto.categoria })}
      className="group block overflow-hidden rounded-2xl bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[3/4] w-full bg-neutral-100">
        {producto.imagen_principal ? (
          <Image
            src={producto.imagen_principal}
            alt={producto.nombre}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            Sin imagen
          </div>
        )}
        {hasDiscount ? (
          <span className="absolute left-3 top-3 rounded-full bg-rosa-500 px-3 py-1 text-[10px] font-medium tracking-wider text-white">
            OFERTA
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-[10px] tracking-[0.25em] text-neutral-500">
          {producto.categoria.toUpperCase()}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm text-neutral-900">{producto.nombre}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base text-rosa-500">{formatPrice(producto.precio_final)}</span>
          {hasDiscount ? (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(producto.precio)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
