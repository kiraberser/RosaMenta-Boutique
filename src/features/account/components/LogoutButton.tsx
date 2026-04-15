"use client";

import { useTransition } from "react";

import { logoutAction } from "@features/auth/actions";

export function LogoutButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => {
        await logoutAction();
      })}
      className={
        className ??
        "rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-700 transition hover:border-rosa-500 hover:text-rosa-500 disabled:opacity-60"
      }
    >
      {isPending ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}
