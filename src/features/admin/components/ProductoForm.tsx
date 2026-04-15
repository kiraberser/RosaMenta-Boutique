"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createProductoAction } from "@features/admin/actions/productos";
import type { Categoria, Marca } from "@features/admin/types";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

type Option = { id: number; nombre: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-white bg-white px-8 py-3 font-mono text-xs tracking-[0.25em] text-black transition hover:bg-neutral-200 disabled:opacity-50"
    >
      {pending ? "[GUARDANDO...]" : "CREAR PRODUCTO"}
    </button>
  );
}

function Field({
  label,
  code,
  children,
  error,
}: {
  label: string;
  code: string;
  children: React.ReactNode;
  error?: string;
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
      {error ? (
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-[#D71921]">
          [ERR] {error}
        </p>
      ) : null}
    </div>
  );
}

const inputCls =
  "w-full border border-neutral-800 bg-black px-3 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none";

export function ProductoForm({
  categorias,
  marcas,
}: {
  categorias: (Categoria | Option)[];
  marcas: (Marca | Option)[];
}) {
  const router = useRouter();
  const [state, action] = useCompatActionState(createProductoAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state?.success && state.data?.id) {
      router.push("/admin/productos");
    }
  }, [state, router]);

  const errors = !state?.success ? state?.errors : undefined;
  const getErr = (k: string) => {
    const v = errors?.[k];
    if (!v) return undefined;
    return Array.isArray(v) ? v[0] : v;
  };

  return (
    <form action={action} className="space-y-8" encType="multipart/form-data">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Nombre" code="01" error={getErr("nombre")}>
          <input name="nombre" required className={inputCls} />
        </Field>
        <Field label="SKU" code="02" error={getErr("sku")}>
          <input name="sku" required className={`${inputCls} font-mono`} />
        </Field>
      </div>

      <Field label="Descripción" code="03" error={getErr("descripcion")}>
        <textarea
          name="descripcion"
          required
          rows={5}
          className={`${inputCls} resize-y`}
        />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Field label="Precio" code="04" error={getErr("precio")}>
          <input
            type="number"
            step="0.01"
            min="0"
            name="precio"
            required
            className={`${inputCls} font-mono`}
          />
        </Field>
        <Field
          label="Descuento"
          code="05"
          error={getErr("precio_descuento")}
        >
          <input
            type="number"
            step="0.01"
            min="0"
            name="precio_descuento"
            placeholder="opcional"
            className={`${inputCls} font-mono`}
          />
        </Field>
        <Field label="Estado" code="06">
          <select name="estado" defaultValue="NVO" className={inputCls}>
            <option value="NVO">Nuevo</option>
            <option value="UBS">Usado</option>
            <option value="REC">Reacondicionado</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Categoría" code="07" error={getErr("categoria_id")}>
          <select name="categoria_id" required className={inputCls}>
            <option value="">— seleccionar —</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Marca" code="08" error={getErr("marca_id")}>
          <select name="marca_id" required className={inputCls}>
            <option value="">— seleccionar —</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-neutral-400">
        <input type="checkbox" name="destacado" className="h-4 w-4 accent-white" />
        DESTACADO EN HOME
      </label>

      <Field label="Imagen inicial" code="09" error={getErr("imagen")}>
        <input
          type="file"
          name="imagen"
          accept="image/*"
          className="w-full border border-neutral-800 bg-black px-3 py-2 text-sm text-neutral-300 file:mr-3 file:border file:border-neutral-700 file:bg-black file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:tracking-[0.2em] file:text-neutral-300"
        />
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-neutral-600">
          OPCIONAL. SI LA SUBES AQUÍ, SE GUARDA COMO IMAGEN PRINCIPAL.
        </p>
      </Field>

      {!state?.success && state?.message ? (
        <p className="border border-[#D71921] bg-[#D71921]/10 px-4 py-3 font-mono text-xs tracking-[0.2em] text-[#D71921]">
          [ERROR] {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4 border-t border-neutral-900 pt-6">
        <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-600">
          SE CREA EN BORRADOR. SUBE 4 IMÁGENES PARA ACTIVAR.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
