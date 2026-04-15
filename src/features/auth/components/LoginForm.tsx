"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { initialActionState } from "@shared/lib/action-types";
import { useCompatActionState } from "@shared/lib/use-compat-action-state";

import { loginAction } from "../actions";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";

const inputCls =
  "mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rosa-500";
export function LoginForm() {
  const [state, action] = useCompatActionState(
    loginAction,
    initialActionState,
  );
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (state.success) {
      const next = params.get("next") ?? "/cuenta";
      router.push(next);
      router.refresh();
    }
  }, [state.success, params, router]);

  return (
    <form action={action} className="space-y-5">
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
        <label htmlFor="password" className="text-sm text-neutral-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputCls}
        />
        <FieldError errors={state.errors} name="password" />
      </div>

      {state.message && !state.success ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.message}</p>
      ) : null}

      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
}
