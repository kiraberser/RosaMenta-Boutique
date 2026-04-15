"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const PAGE_SIZE = 20;

export function Pagination({ count, page }: { count: number; page: number }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (totalPages <= 1) return null;

  function hrefFor(p: number): string {
    const next = new URLSearchParams(params.toString());
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    return `${pathname}?${next.toString()}`;
  }

  const prev = Math.max(1, page - 1);
  const nextP = Math.min(totalPages, page + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginación">
      <Link
        href={hrefFor(prev)}
        aria-disabled={page === 1}
        className={`rounded-full border border-neutral-300 px-4 py-2 text-sm transition hover:border-rosa-500 ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
      >
        ← Anterior
      </Link>
      <span className="px-4 text-sm text-neutral-600">
        Página {page} de {totalPages}
      </span>
      <Link
        href={hrefFor(nextP)}
        aria-disabled={page === totalPages}
        className={`rounded-full border border-neutral-300 px-4 py-2 text-sm transition hover:border-rosa-500 ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
      >
        Siguiente →
      </Link>
    </nav>
  );
}
