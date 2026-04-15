"use client";

import { useTransition } from "react";

import type { Direccion } from "@features/auth/types";

import { eliminarDireccionAction } from "../actions";

export function DireccionCard({ direccion }: { direccion: Direccion }) {
  const [isPending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm("¿Eliminar esta dirección?")) return;
    startTransition(async () => {
      await eliminarDireccionAction(direccion.id);
    });
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5">
      <div className="text-sm">
        <p className="text-neutral-900">{direccion.calle}</p>
        <p className="text-neutral-600">
          {direccion.ciudad}, {direccion.estado} · CP {direccion.cp}
        </p>
        <p className="text-neutral-500">{direccion.pais}</p>
        {direccion.es_principal ? (
          <span className="mt-2 inline-block rounded-full bg-menta-50 px-2 py-0.5 text-[10px] text-menta-400">
            Principal
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={isPending}
        className="text-xs text-neutral-500 transition hover:text-red-600 disabled:opacity-50"
      >
        {isPending ? "..." : "Eliminar"}
      </button>
    </div>
  );
}
