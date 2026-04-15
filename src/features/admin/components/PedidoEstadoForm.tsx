"use client";

import { useFormStatus } from "react-dom";

import { cambiarEstadoPedidoAction } from "@features/admin/actions/productos";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

const ESTADOS = ["CREADO", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"];

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-white bg-white px-5 py-2 font-mono text-[11px] tracking-[0.25em] text-black hover:bg-neutral-200 disabled:opacity-50"
    >
      {pending ? "[...]" : "CAMBIAR"}
    </button>
  );
}

export function PedidoEstadoForm({
  pedidoId,
  actual,
}: {
  pedidoId: number;
  actual: string;
}) {
  const [state, action] = useCompatActionState(
    cambiarEstadoPedidoAction,
    {
      success: false,
      message: "",
    },
  );

  return (
    <form
      action={action}
      className="flex flex-col gap-3 border border-neutral-900 bg-neutral-950 p-4 sm:flex-row sm:items-center"
    >
      <input type="hidden" name="id" value={pedidoId} />
      <div className="flex-1">
        <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">
          NUEVO ESTADO
        </p>
        <select
          name="estado"
          defaultValue={actual}
          className="mt-1 w-full border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white focus:border-white focus:outline-none"
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <Btn />
      {state.message ? (
        <p
          className={`font-mono text-[10px] tracking-[0.2em] ${
            state.success ? "text-[#00C853]" : "text-[#D71921]"
          }`}
        >
          [{state.success ? "OK" : "ERR"}] {state.message}
        </p>
      ) : null}
    </form>
  );
}
