"use client";

// "use client" obligatorio: error boundaries de Next deben correr en cliente
// para exponer el callback `reset`.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs tracking-[0.3em] text-neutral-500">ALGO FALLÓ</p>
        <h1 className="mt-2 text-4xl text-rosa-500">Tuvimos un inconveniente</h1>
        <p className="mt-4 max-w-md text-neutral-600">
          {error.message || "Intenta de nuevo en un momento."}
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-full bg-rosa-500 px-8 py-3 text-sm text-white transition hover:bg-rosa-600"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
