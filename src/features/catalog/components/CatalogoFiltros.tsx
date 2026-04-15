"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import type { Categoria, Marca } from "../types";

type Props = {
  categorias: Categoria[];
  marcas: Marca[];
};

export function CatalogoFiltros({ categorias, marcas }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  const selectCls =
    "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-rosa-500";

  return (
    <aside
      className="space-y-5"
      aria-busy={isPending}
    >
      <div>
        <label className="text-xs tracking-[0.25em] text-neutral-500">CATEGORÍA</label>
        <select
          defaultValue={params.get("categoria") ?? ""}
          onChange={(e) => update("categoria", e.target.value)}
          className={`mt-2 ${selectCls}`}
        >
          <option value="">Todas</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs tracking-[0.25em] text-neutral-500">MARCA</label>
        <select
          defaultValue={params.get("marca") ?? ""}
          onChange={(e) => update("marca", e.target.value)}
          className={`mt-2 ${selectCls}`}
        >
          <option value="">Todas</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs tracking-[0.25em] text-neutral-500">ESTADO</label>
        <select
          defaultValue={params.get("estado") ?? ""}
          onChange={(e) => update("estado", e.target.value)}
          className={`mt-2 ${selectCls}`}
        >
          <option value="">Cualquiera</option>
          <option value="NUE">Nuevo</option>
          <option value="USA">Usado</option>
          <option value="REA">Reacondicionado</option>
        </select>
      </div>

      <div>
        <label className="text-xs tracking-[0.25em] text-neutral-500">ORDENAR</label>
        <select
          defaultValue={params.get("ordering") ?? ""}
          onChange={(e) => update("ordering", e.target.value)}
          className={`mt-2 ${selectCls}`}
        >
          <option value="">Más recientes</option>
          <option value="precio">Precio: menor a mayor</option>
          <option value="-precio">Precio: mayor a menor</option>
        </select>
      </div>
    </aside>
  );
}
