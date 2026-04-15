"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createVarianteAction,
  deleteVarianteAction,
} from "@features/admin/actions/productos";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

type Variante = {
  id: number;
  talla: string;
  color: string;
  sku_variante: string;
  precio_extra: string;
  precio_final: string;
};

function AddBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-white px-5 py-2 font-mono text-[11px] tracking-[0.25em] text-white hover:bg-white hover:text-black disabled:opacity-50"
    >
      {pending ? "[...]" : "+ AGREGAR"}
    </button>
  );
}

function DelBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-[10px] tracking-[0.2em] text-[#D71921] hover:underline disabled:opacity-50"
    >
      {pending ? "..." : "×"}
    </button>
  );
}

const input =
  "w-full border border-neutral-800 bg-black px-2 py-2 font-mono text-xs text-white focus:border-white focus:outline-none";

export function VariantesManager({
  productoId,
  variantes,
}: {
  productoId: number;
  variantes: Variante[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useCompatActionState(createVarianteAction, {
    success: false,
    message: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
          VARIANTES · [{String(variantes.length).padStart(2, "0")}]
        </h2>
      </div>

      {variantes.length > 0 ? (
        <div className="overflow-x-auto border border-neutral-900">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-950">
              <tr>
                {["Talla", "Color", "SKU", "Extra", "Final", ""].map((h) => (
                  <th
                    key={h}
                    className="border-b border-neutral-900 px-3 py-2 text-left font-mono text-[10px] tracking-[0.25em] text-neutral-500"
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variantes.map((v) => (
                <tr key={v.id} className="border-b border-neutral-900 last:border-0">
                  <td className="px-3 py-3 font-mono text-white">{v.talla}</td>
                  <td className="px-3 py-3 text-neutral-200">{v.color}</td>
                  <td className="px-3 py-3 font-mono text-xs text-neutral-400">
                    {v.sku_variante}
                  </td>
                  <td className="px-3 py-3 font-mono text-neutral-400">
                    +${v.precio_extra}
                  </td>
                  <td className="px-3 py-3 font-mono text-white">
                    ${v.precio_final}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <form action={deleteVarianteAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <input type="hidden" name="producto_id" value={productoId} />
                      <DelBtn />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="border border-dashed border-neutral-800 px-6 py-8 text-center font-mono text-[10px] tracking-[0.25em] text-neutral-600">
          [SIN VARIANTES]
        </p>
      )}

      <form
        ref={formRef}
        action={async (fd) => {
          await action(fd);
          formRef.current?.reset();
        }}
        className="grid grid-cols-2 gap-3 border border-neutral-900 bg-neutral-950 p-4 md:grid-cols-5"
      >
        <input type="hidden" name="producto" value={productoId} />
        <input name="talla" placeholder="TALLA" required className={input} />
        <input name="color" placeholder="COLOR" required className={input} />
        <input
          name="sku_variante"
          placeholder="SKU-VAR"
          required
          className={input}
        />
        <input
          type="number"
          name="precio_extra"
          placeholder="0.00"
          step="0.01"
          min="0"
          defaultValue="0"
          className={input}
        />
        <AddBtn />
      </form>

      {state.message ? (
        <p
          className={`font-mono text-[10px] tracking-[0.2em] ${
            state.success ? "text-[#00C853]" : "text-[#D71921]"
          }`}
        >
          [{state.success ? "OK" : "ERR"}] {state.message}
        </p>
      ) : null}
    </div>
  );
}
