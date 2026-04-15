import type { Metadata } from "next";
import Link from "next/link";

import { bajaNewsletterAction } from "@features/newsletter/actions";

export const metadata: Metadata = {
  title: "Cancelar suscripción",
  robots: { index: false, follow: false },
};

type SearchParams = { token?: string };

export default async function BajaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { token } = await searchParams;
  const result = await bajaNewsletterAction(token ?? "");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.3em] text-neutral-500">NEWSLETTER</p>
        <h1 className="mt-2 text-3xl text-rosa-500">
          {result.success ? "Suscripción cancelada" : "No pudimos cancelar"}
        </h1>
        <p className="mt-4 text-sm text-neutral-600">{result.message}</p>
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
