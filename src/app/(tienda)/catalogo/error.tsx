"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl text-rosa-500">Algo salió mal</h1>
      <p className="mt-4 text-sm text-neutral-600">
        No pudimos cargar el catálogo. Intenta nuevamente.
      </p>
      {error?.digest ? (
        <p className="mt-2 text-xs text-neutral-400">ref: {error.digest}</p>
      ) : null}
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-rosa-500 px-6 py-2 text-sm text-white hover:bg-rosa-600"
      >
        Reintentar
      </button>
    </main>
  );
}
