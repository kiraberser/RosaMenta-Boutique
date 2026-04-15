"use client";

import * as React from "react";
import { useFormState } from "react-dom";

import { cancelarPedidoAction } from "../actions";
import { initialActionState } from "@shared/lib/action-types";

export function CancelarPedidoForm({ pedidoId }: { pedidoId: number }) {
  const [state, action] = (React.useActionState ?? useFormState)(
    cancelarPedidoAction,
    initialActionState,
  );

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("¿Cancelar este pedido?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="pedido_id" value={pedidoId} />
      <input
        type="text"
        name="motivo"
        placeholder="Motivo (opcional)"
        className="mr-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs outline-none focus:border-rosa-500"
      />
      <button
        type="submit"
        className="rounded-full border border-red-200 px-5 py-2 text-xs text-red-600 transition hover:bg-red-50"
      >
        Cancelar pedido
      </button>
      {state.message ? (
        <p className={`mt-2 text-xs ${state.success ? "text-menta-400" : "text-red-600"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
