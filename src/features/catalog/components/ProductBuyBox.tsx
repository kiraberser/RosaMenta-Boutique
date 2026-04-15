"use client";

import Link from "next/link";
import { useState } from "react";

import { AddToCartButton } from "@features/cart/components/AddToCartButton";

import type { ProductoDetalle } from "../types";

export function ProductBuyBox({ producto }: { producto: ProductoDetalle }) {
  const variantes = producto.variantes;
  const [varianteId, setVarianteId] = useState<number | null>(
    variantes[0]?.id ?? null,
  );

  const imagen =
    producto.imagenes.find((i) => i.es_principal)?.imagen_url ??
    producto.imagenes[0]?.imagen_url ??
    null;

  if (variantes.length === 0) {
    return (
      <p className="mt-10 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
        Este producto no tiene variantes disponibles todavía.
      </p>
    );
  }

  const selected = variantes.find((v) => v.id === varianteId) ?? variantes[0];

  return (
    <div className="mt-8">
      <p className="text-xs tracking-[0.25em] text-neutral-500">VARIANTES</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {variantes.map((v) => (
          <li key={v.id}>
            <button
              type="button"
              onClick={() => setVarianteId(v.id)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                v.id === selected.id
                  ? "border-rosa-500 bg-rosa-50 text-rosa-500"
                  : "border-neutral-300 text-neutral-700 hover:border-rosa-500"
              }`}
            >
              {v.talla} · {v.color}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <AddToCartButton
          line={{
            varianteId: selected.id,
            productoId: producto.id,
            nombre: producto.nombre,
            sku: selected.sku_variante,
            talla: selected.talla,
            color: selected.color,
            imagen,
            precio: Number(selected.precio_final),
          }}
        />
        <Link
          href="/cuenta/favoritos"
          className="rounded-full border border-neutral-300 px-8 py-3 text-center text-sm text-neutral-800 transition hover:border-rosa-500 hover:text-rosa-500"
        >
          Guardar en favoritos
        </Link>
      </div>
    </div>
  );
}
