"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pagination({
  page,
  count,
  pageSize,
}: {
  page: number;
  count: number;
  pageSize: number;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const q = new URLSearchParams(params);
    q.set("page", String(p));
    return `${pathname}?${q.toString()}`;
  };

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-between border-t border-neutral-900 pt-4"
    >
      <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-600">
        PÁG {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
        {" · "}
        {count} REGISTROS
      </p>
      <div className="flex gap-2">
        <Link
          href={hrefFor(prev)}
          aria-disabled={page === 1}
          className={`border px-4 py-2 font-mono text-[11px] tracking-[0.25em] ${
            page === 1
              ? "pointer-events-none border-neutral-900 text-neutral-700"
              : "border-neutral-700 text-neutral-300 hover:border-white hover:text-white"
          }`}
        >
          ← ANT
        </Link>
        <Link
          href={hrefFor(next)}
          aria-disabled={page === totalPages}
          className={`border px-4 py-2 font-mono text-[11px] tracking-[0.25em] ${
            page === totalPages
              ? "pointer-events-none border-neutral-900 text-neutral-700"
              : "border-neutral-700 text-neutral-300 hover:border-white hover:text-white"
          }`}
        >
          SIG →
        </Link>
      </div>
    </nav>
  );
}
