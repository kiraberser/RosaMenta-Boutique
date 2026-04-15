"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-rosa-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-rosa-600 disabled:opacity-60"
    >
      {pending ? "Procesando..." : children}
    </button>
  );
}
