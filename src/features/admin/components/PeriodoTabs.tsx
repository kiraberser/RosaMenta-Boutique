"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const OPTS = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
] as const;

export function PeriodoTabs({ current }: { current: string }) {
  const pathname = usePathname();
  const params = useSearchParams();

  const buildHref = (p: string) => {
    const q = new URLSearchParams(params);
    q.set("periodo", p);
    return `${pathname}?${q.toString()}`;
  };

  return (
    <nav className="inline-flex border border-neutral-800">
      {OPTS.map((o) => {
        const active = current === o.value;
        return (
          <Link
            key={o.value}
            href={buildHref(o.value)}
            scroll={false}
            className={`px-4 py-2 font-mono text-[11px] tracking-[0.25em] transition ${
              active
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {o.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
