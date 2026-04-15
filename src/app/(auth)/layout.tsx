import Link from "next/link";

import { SITE_NAME } from "@shared/lib/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-gradient-to-br from-rosa-50 via-white to-menta-50 p-12 lg:flex">
        <Link href="/" className="text-sm tracking-[0.3em] text-neutral-500">
          {SITE_NAME.toUpperCase()}
        </Link>
        <div>
          <h2 className="text-5xl text-rosa-500">
            Moda pensada <span className="text-menta-400">para ti</span>
          </h2>
          <p className="mt-6 max-w-md text-neutral-600">
            Crea tu cuenta para guardar favoritos, ver el estado de tus pedidos y recibir ofertas
            exclusivas.
          </p>
        </div>
        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} {SITE_NAME}</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
