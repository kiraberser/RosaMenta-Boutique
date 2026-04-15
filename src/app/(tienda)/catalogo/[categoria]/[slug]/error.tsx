"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl text-rosa-500">No pudimos mostrar el producto</h1>
      <p className="mt-4 text-sm text-neutral-600">
        Hubo un problema al cargar la ficha. Puedes reintentar o volver al catálogo.
      </p>
      {error?.digest ? (
        <p className="mt-2 text-xs text-neutral-400">ref: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-rosa-500 px-6 py-2 text-sm text-white hover:bg-rosa-600"
        >
          Reintentar
        </button>
        <Link
          href="/catalogo"
          className="rounded-full border border-neutral-300 px-6 py-2 text-sm text-neutral-700 hover:border-rosa-500 hover:text-rosa-500"
        >
          Ir al catálogo
        </Link>
      </div>
    </main>
  );
}
