"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { formatPrice } from "@shared/lib/format";

import { useCartStore } from "../store/cartStore";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => (o ? null : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
            <Dialog.Title className="text-lg text-rosa-500">Tu carrito</Dialog.Title>
            <Dialog.Close
              className="rounded-full p-2 transition hover:bg-neutral-100"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {lines.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <p className="text-sm text-neutral-500">Tu carrito está vacío.</p>
                  <Link
                    href="/catalogo"
                    onClick={close}
                    className="mt-4 inline-block text-sm text-rosa-500 hover:underline"
                  >
                    Ver catálogo →
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-5">
                {lines.map((l) => (
                  <li key={l.varianteId} className="flex gap-3">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {l.imagen ? (
                        <Image
                          src={l.imagen}
                          alt={l.nombre}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">{l.nombre}</p>
                      <p className="text-xs text-neutral-500">
                        {l.talla} · {l.color}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(l.varianteId, l.cantidad - 1)}
                          className="h-7 w-7 rounded-full border border-neutral-300 text-sm hover:border-rosa-500"
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <span className="min-w-[2ch] text-center text-sm">{l.cantidad}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(l.varianteId, l.cantidad + 1)}
                          className="h-7 w-7 rounded-full border border-neutral-300 text-sm hover:border-rosa-500"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(l.varianteId)}
                          className="ml-auto text-xs text-neutral-500 hover:text-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-800">
                      {formatPrice(l.precio * l.cantidad)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 ? (
            <footer className="border-t border-neutral-200 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-500">Subtotal</span>
                <span className="text-lg text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="mt-4 block w-full rounded-full bg-rosa-500 py-3 text-center text-sm font-medium text-white transition hover:bg-rosa-600"
              >
                Ir al checkout
              </Link>
              <p className="mt-3 text-center text-[11px] text-neutral-500">
                Confirmamos por WhatsApp. Envío gratis en CDMX a partir de $999 MXN.
              </p>
            </footer>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
