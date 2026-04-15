"use client";

import { ShoppingBag } from "lucide-react";

import { useCartStore } from "../store/cartStore";

export function CartIconButton() {
  const open = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.totalItems());

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Abrir carrito"
      className="relative rounded-full p-2 transition hover:bg-neutral-100"
    >
      <ShoppingBag className="h-5 w-5 text-neutral-800" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rosa-500 px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}
