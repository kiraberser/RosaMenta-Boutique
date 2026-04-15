"use client";

import { useTransition } from "react";

import { syncAddToServerAction } from "../actions";
import { useCartStore } from "../store/cartStore";
import type { CartLine } from "../types";

type Props = {
  line: Omit<CartLine, "cantidad">;
  cantidad?: number;
  className?: string;
  children?: React.ReactNode;
};

export function AddToCartButton({
  line,
  cantidad = 1,
  className,
  children,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const add = useCartStore((s) => s.add);
  const open = useCartStore((s) => s.open);

  function handleClick() {
    add({ ...line, cantidad });
    open();
    startTransition(async () => {
      await syncAddToServerAction(line.varianteId, cantidad);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={
        className ??
        "rounded-full bg-rosa-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-rosa-600 disabled:opacity-60"
      }
    >
      {children ?? "Agregar al carrito"}
    </button>
  );
}
