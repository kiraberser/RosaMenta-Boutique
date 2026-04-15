"use client";

import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@shared/lib/format";
import { useCartStore } from "@features/cart/store/cartStore";

export default function CarritoPage() {
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartStore((s) => s.hydrated);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-neutral-100" />
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl text-rosa-500">Tu carrito está vacío</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Descubre nuestras piezas y añade tus favoritas al carrito.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block rounded-full bg-rosa-500 px-6 py-2 text-sm text-white hover:bg-rosa-600"
        >
          Ir al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl text-rosa-500">Tu carrito</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-neutral-200">
          {lines.map((l) => (
            <li key={l.varianteId} className="flex gap-4 py-6">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {l.imagen ? (
                  <Image src={l.imagen} alt={l.nombre} fill className="object-cover" sizes="96px" />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-900">{l.nombre}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Talla {l.talla} · {l.color}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => updateQty(l.varianteId, l.cantidad - 1)}
                    className="h-8 w-8 rounded-full border border-neutral-300 text-sm hover:border-rosa-500"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{l.cantidad}</span>
                  <button
                    onClick={() => updateQty(l.varianteId, l.cantidad + 1)}
                    className="h-8 w-8 rounded-full border border-neutral-300 text-sm hover:border-rosa-500"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                  <button
                    onClick={() => remove(l.varianteId)}
                    className="ml-4 text-xs text-neutral-500 hover:text-rosa-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="text-sm text-neutral-900">
                {formatPrice(l.precio * l.cantidad)}
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm tracking-[0.25em] text-neutral-500">RESUMEN</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd className="text-neutral-900">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Envío</dt>
              <dd className="text-neutral-500">A calcular</dd>
            </div>
          </dl>
          <div className="mt-6 flex items-baseline justify-between border-t border-neutral-200 pt-4">
            <span className="text-sm text-neutral-500">Total</span>
            <span className="text-xl text-rosa-500">{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-rosa-500 py-3 text-center text-sm text-white hover:bg-rosa-600"
          >
            Ir a checkout
          </Link>
          <Link
            href="/catalogo"
            className="mt-2 block text-center text-xs text-neutral-500 hover:text-rosa-500"
          >
            Seguir comprando
          </Link>
        </aside>
      </div>
    </main>
  );
}
