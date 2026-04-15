"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@shared/lib/cn";

const LINKS = [
  { href: "/cuenta", label: "Perfil" },
  { href: "/cuenta/pedidos", label: "Pedidos" },
  { href: "/cuenta/direcciones", label: "Direcciones" },
  { href: "/cuenta/favoritos", label: "Favoritos" },
];

export function CuentaNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-xl px-4 py-2 text-sm transition",
              active
                ? "bg-rosa-50 text-rosa-500"
                : "text-neutral-700 hover:bg-neutral-100",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
