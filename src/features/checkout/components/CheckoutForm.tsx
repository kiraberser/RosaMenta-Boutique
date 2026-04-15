"use client";

import { useEffect, useState } from "react";

import { FieldError } from "@features/auth/components/FieldError";
import { SubmitButton } from "@features/auth/components/SubmitButton";
import type { Direccion } from "@features/auth/types";
import { DireccionForm } from "@features/direcciones/components/DireccionForm";
import { useCartStore } from "@features/cart/store/cartStore";
import { initialActionState } from "@shared/lib/action-types";
import { formatPrice } from "@shared/lib/format";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

import { crearPedidoAction } from "../actions";

const selectCls =
  "mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-rosa-500";

export function CheckoutForm({ direcciones }: { direcciones: Direccion[] }) {
  const [state, action] = useCompatActionState(
    crearPedidoAction,
    initialActionState,
  );
  const [showNew, setShowNew] = useState(direcciones.length === 0);
  const subtotal = useCartStore((s) => s.subtotal());
  const count = useCartStore((s) => s.totalItems());
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    if (state.success) clear();
  }, [state.success, clear]);

  const principal = direcciones.find((d) => d.es_principal) ?? direcciones[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <form action={action} className="space-y-8">
        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-lg text-rosa-500">1. Dirección de envío</h2>
          {direcciones.length > 0 ? (
            <div className="mt-4 space-y-2">
              {direcciones.map((d) => (
                <label
                  key={d.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 text-sm hover:border-rosa-500"
                >
                  <input
                    type="radio"
                    name="direccion_id"
                    value={d.id}
                    defaultChecked={d.id === principal?.id}
                    required
                    className="mt-1 h-4 w-4 text-rosa-500"
                  />
                  <div>
                    <p className="text-neutral-900">{d.calle}</p>
                    <p className="text-neutral-600">
                      {d.ciudad}, {d.estado} · CP {d.cp} · {d.pais}
                    </p>
                    {d.es_principal ? (
                      <span className="mt-1 inline-block rounded-full bg-menta-50 px-2 py-0.5 text-[10px] text-menta-400">
                        Principal
                      </span>
                    ) : null}
                  </div>
                </label>
              ))}
              <FieldError errors={state.errors} name="direccion_id" />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="text-sm text-rosa-500 hover:underline"
              >
                {showNew ? "Ocultar formulario" : "+ Agregar otra dirección"}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-neutral-600">
              Aún no tienes direcciones guardadas. Agrega una para continuar.
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-lg text-rosa-500">2. Método de pago</h2>
          <p className="mt-1 text-xs text-neutral-500">
            La confirmación final se hace por WhatsApp.
          </p>
          <select name="metodo_pago" defaultValue="TRA" className={selectCls}>
            <option value="TRA">Transferencia bancaria</option>
            <option value="EFE">Efectivo (entrega)</option>
          </select>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-lg text-rosa-500">3. Notas</h2>
          <textarea
            name="notas"
            rows={3}
            maxLength={500}
            placeholder="Indicaciones de entrega, horario, etc."
            className={selectCls}
          />
        </section>

        {state.message && !state.success ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</p>
        ) : null}

        <SubmitButton>Confirmar pedido</SubmitButton>
      </form>

      <aside className="space-y-6">
        {showNew ? <DireccionForm onCreated={() => setShowNew(false)} /> : null}

        <div className="rounded-2xl bg-white p-6">
          <h3 className="text-sm tracking-[0.25em] text-neutral-500">RESUMEN</h3>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-neutral-600">Artículos</span>
            <span className="text-neutral-900">{count}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal</span>
            <span className="text-neutral-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-4 border-t border-neutral-200 pt-4 flex justify-between">
            <span className="text-neutral-900">Total</span>
            <span className="text-lg text-rosa-500">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-4 text-[11px] text-neutral-500">
            El total final se confirma por WhatsApp junto con el envío.
          </p>
        </div>
      </aside>
    </div>
  );
}
