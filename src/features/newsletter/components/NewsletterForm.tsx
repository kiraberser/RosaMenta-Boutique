"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { initialActionState } from "@shared/lib/action-types";

import { suscribirNewsletterAction } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-rosa-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-rosa-600 disabled:opacity-60"
    >
      {pending ? "..." : "Suscribirme"}
    </button>
  );
}

type Props = {
  origen?: string;
  variant?: "inline" | "stacked";
};

export function NewsletterForm({ origen = "FOR", variant = "inline" }: Props) {
  const [state, action] = (React.useActionState ?? useFormState)(
    suscribirNewsletterAction,
    initialActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="w-full">
      <input type="hidden" name="origen" value={origen} />
      <div
        className={
          variant === "stacked"
            ? "flex flex-col gap-3"
            : "flex flex-col gap-2 sm:flex-row"
        }
      >
        <input
          type="email"
          name="email"
          required
          placeholder="tu@correo.com"
          aria-label="Correo"
          className="flex-1 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm outline-none focus:border-rosa-500"
        />
        <Submit />
      </div>
      {state.message ? (
        <p
          className={`mt-3 text-xs ${
            state.success ? "text-menta-400" : "text-red-600"
          }`}
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
