"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-32 text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-[#D71921]">
        [ERROR · {error.digest ?? "UNKNOWN"}]
      </p>
      <p className="mt-4 text-sm text-neutral-400">
        No se pudo cargar el módulo.
      </p>
      <button
        onClick={reset}
        className="mt-8 border border-white px-6 py-2 font-mono text-[11px] tracking-[0.25em] text-white hover:bg-white hover:text-black"
      >
        REINTENTAR
      </button>
    </div>
  );
}
