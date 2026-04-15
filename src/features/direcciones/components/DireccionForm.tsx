"use client";

import { useEffect, useRef } from "react";

import { FieldError } from "@features/auth/components/FieldError";
import { SubmitButton } from "@features/auth/components/SubmitButton";
import { initialActionState } from "@shared/lib/action-types";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

import { crearDireccionAction } from "../actions";

const inputCls =
  "mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-rosa-500";

export function DireccionForm({ onCreated }: { onCreated?: () => void }) {
  const [state, action] = useCompatActionState(
    crearDireccionAction,
    initialActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onCreated?.();
    }
  }, [state.success, onCreated]);

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-2xl bg-white p-6">
      <h3 className="text-lg text-rosa-500">Nueva dirección</h3>

      <div>
        <label htmlFor="calle" className="text-sm text-neutral-700">Calle y número</label>
        <input id="calle" name="calle" required className={inputCls} />
        <FieldError errors={state.errors} name="calle" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ciudad" className="text-sm text-neutral-700">Ciudad</label>
          <input id="ciudad" name="ciudad" required className={inputCls} />
          <FieldError errors={state.errors} name="ciudad" />
        </div>
        <div>
          <label htmlFor="cp" className="text-sm text-neutral-700">Código postal</label>
          <input id="cp" name="cp" inputMode="numeric" required className={inputCls} />
          <FieldError errors={state.errors} name="cp" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="estado" className="text-sm text-neutral-700">Estado</label>
          <input id="estado" name="estado" required className={inputCls} />
          <FieldError errors={state.errors} name="estado" />
        </div>
        <div>
          <label htmlFor="pais" className="text-sm text-neutral-700">País</label>
          <input id="pais" name="pais" defaultValue="México" className={inputCls} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="es_principal" className="h-4 w-4 rounded border-neutral-300 text-rosa-500" />
        Marcar como principal
      </label>

      {state.message && !state.success ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.message}</p>
      ) : null}

      <SubmitButton>Guardar dirección</SubmitButton>
    </form>
  );
}
