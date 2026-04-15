import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs tracking-[0.3em] text-neutral-500">ERROR 404</p>
        <h1 className="mt-2 text-5xl text-rosa-500">Página no encontrada</h1>
        <p className="mt-4 text-neutral-600">Esa prenda se perdió en el ropero.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-rosa-500 px-8 py-3 text-sm text-white transition hover:bg-rosa-600"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
