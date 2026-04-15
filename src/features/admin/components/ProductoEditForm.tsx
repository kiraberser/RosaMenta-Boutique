"use client";

import { useFormStatus } from "react-dom";

import {
  toggleActivoAction,
  updateProductoAction,
} from "@features/admin/actions/productos";
import type { Categoria, Marca } from "@features/admin/types";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  sku: string;
  precio: string;
  precio_descuento: string | null;
  estado: string;
  activo: boolean;
  destacado: boolean;
  categoria: { id: number };
  marca: { id: number };
};

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-white bg-white px-6 py-2.5 font-mono text-[11px] tracking-[0.25em] text-black hover:bg-neutral-200 disabled:opacity-50"
    >
      {pending ? "[...]" : "GUARDAR"}
    </button>
  );
}

function ToggleBtn({ activo }: { activo: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`border px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] disabled:opacity-50 ${
        activo
          ? "border-[#D71921] text-[#D71921] hover:bg-[#D71921] hover:text-white"
          : "border-[#00C853] text-[#00C853] hover:bg-[#00C853] hover:text-black"
      }`}
    >
      {pending ? "[...]" : activo ? "○ DESACTIVAR" : "● ACTIVAR"}
    </button>
  );
}

const input =
  "w-full border border-neutral-800 bg-black px-3 py-3 text-sm text-white focus:border-white focus:outline-none";

export function ProductoEditForm({
  producto,
  categorias,
  marcas,
}: {
  producto: Producto;
  categorias: Categoria[];
  marcas: Marca[];
}) {
  const [state, action] = useCompatActionState(updateProductoAction, {
    success: false,
    message: "",
  });
  const errs = !state.success ? state.errors : undefined;
  const getErr = (k: string) => {
    const v = errs?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  return (
    <div className="space-y-6">
      <form
        action={toggleActivoAction}
        className="flex items-center justify-between border border-neutral-900 bg-neutral-950 px-4 py-3"
      >
        <input type="hidden" name="id" value={producto.id} />
        <input type="hidden" name="activo" value={String(producto.activo)} />
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500">
            ESTADO
          </p>
          <p
            className={`mt-1 font-mono text-xs tracking-[0.2em] ${
              producto.activo ? "text-[#00C853]" : "text-neutral-400"
            }`}
          >
            {producto.activo ? "● ACTIVO · VISIBLE EN TIENDA" : "○ BORRADOR"}
          </p>
        </div>
        <ToggleBtn activo={producto.activo} />
      </form>

      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={producto.id} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldLbl label="Nombre" code="01" err={getErr("nombre")}>
            <input
              name="nombre"
              defaultValue={producto.nombre}
              required
              className={input}
            />
          </FieldLbl>
          <FieldLbl label="SKU" code="02" err={getErr("sku")}>
            <input
              name="sku"
              defaultValue={producto.sku}
              required
              className={`${input} font-mono`}
            />
          </FieldLbl>
        </div>

        <FieldLbl label="Descripción" code="03" err={getErr("descripcion")}>
          <textarea
            name="descripcion"
            defaultValue={producto.descripcion}
            required
            rows={5}
            className={`${input} resize-y`}
          />
        </FieldLbl>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FieldLbl label="Precio" code="04" err={getErr("precio")}>
            <input
              type="number"
              step="0.01"
              name="precio"
              defaultValue={producto.precio}
              required
              className={`${input} font-mono`}
            />
          </FieldLbl>
          <FieldLbl label="Descuento" code="05">
            <input
              type="number"
              step="0.01"
              name="precio_descuento"
              defaultValue={producto.precio_descuento ?? ""}
              className={`${input} font-mono`}
            />
          </FieldLbl>
          <FieldLbl label="Estado" code="06">
            <select
              name="estado"
              defaultValue={producto.estado}
              className={input}
            >
              <option value="NVO">Nuevo</option>
              <option value="UBS">Usado</option>
              <option value="REC">Reacondicionado</option>
            </select>
          </FieldLbl>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FieldLbl label="Categoría" code="07">
            <select
              name="categoria_id"
              defaultValue={producto.categoria.id}
              required
              className={input}
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </FieldLbl>
          <FieldLbl label="Marca" code="08">
            <select
              name="marca_id"
              defaultValue={producto.marca.id}
              required
              className={input}
            >
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </FieldLbl>
        </div>

        <label className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-neutral-400">
          <input
            type="checkbox"
            name="destacado"
            defaultChecked={producto.destacado}
            className="h-4 w-4 accent-white"
          />
          DESTACADO EN HOME
        </label>

        {state.message ? (
          <p
            className={`font-mono text-[10px] tracking-[0.2em] ${
              state.success ? "text-[#00C853]" : "text-[#D71921]"
            }`}
          >
            [{state.success ? "OK" : "ERR"}] {state.message}
          </p>
        ) : null}

        <div className="flex justify-end border-t border-neutral-900 pt-4">
          <SaveBtn />
        </div>
      </form>
    </div>
  );
}

function FieldLbl({
  label,
  code,
  children,
  err,
}: {
  label: string;
  code: string;
  children: React.ReactNode;
  err?: string | string[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">
          {label.toUpperCase()}
        </label>
        <span className="font-mono text-[10px] text-neutral-700">[{code}]</span>
      </div>
      <div className="mt-2">{children}</div>
      {err ? (
        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#D71921]">
          [ERR] {Array.isArray(err) ? err[0] : err}
        </p>
      ) : null}
    </div>
  );
}
