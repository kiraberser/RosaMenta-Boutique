"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { initialActionState } from "@shared/lib/action-types";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

import { registerAction } from "../actions";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";

const inputCls =
  "mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rosa-500";
export function RegisterForm() {
  const [state, action] = useCompatActionState(
    registerAction,
    initialActionState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/cuenta");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="text-sm text-neutral-700">
            Nombre
          </label>
          <input id="nombre" name="nombre" required className={inputCls} />
          <FieldError errors={state.errors} name="nombre" />
        </div>
        <div>
          <label htmlFor="apellido" className="text-sm text-neutral-700">
            Apellido
          </label>
          <input id="apellido" name="apellido" required className={inputCls} />
          <FieldError errors={state.errors} name="apellido" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm text-neutral-700">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputCls}
        />
        <FieldError errors={state.errors} name="email" />
      </div>

      <div>
        <label htmlFor="telefono" className="text-sm text-neutral-700">
          Teléfono (opcional)
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          placeholder="+52..."
          className={inputCls}
        />
        <FieldError errors={state.errors} name="telefono" />
      </div>

      <div>
        <label htmlFor="password" className="text-sm text-neutral-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className={inputCls}
        />
        <FieldError errors={state.errors} name="password" />
      </div>

      <div>
        <label htmlFor="password_confirm" className="text-sm text-neutral-700">
          Confirmar contraseña
        </label>
        <input
          id="password_confirm"
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          required
          className={inputCls}
        />
        <FieldError errors={state.errors} name="password_confirm" />
      </div>

      <label className="flex items-start gap-3 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="suscribir_newsletter"
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-rosa-500 focus:ring-rosa-500"
        />
        <span>Quiero recibir novedades y promociones por correo.</span>
      </label>

      {state.message && !state.success ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.message}</p>
      ) : null}

      <SubmitButton>Crear cuenta</SubmitButton>
    </form>
  );
}
