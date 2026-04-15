"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string; code: string };

const ITEMS: Item[] = [
  { href: "/admin", label: "Dashboard", code: "00" },
  { href: "/admin/productos", label: "Productos", code: "01" },
  { href: "/admin/catalogo", label: "Catálogo", code: "1B" },
  { href: "/admin/inventario", label: "Inventario", code: "02" },
  { href: "/admin/proveedores", label: "Proveedores", code: "07" },
  { href: "/admin/pedidos", label: "Pedidos", code: "03" },
  { href: "/admin/ventas", label: "Ventas", code: "04" },
  { href: "/admin/newsletter", label: "Newsletter", code: "05" },
  { href: "/admin/usuarios", label: "Usuarios", code: "06" },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menú"
        className="fixed left-4 top-4 z-50 h-10 w-10 border border-neutral-800 bg-black font-mono text-xs text-white md:hidden"
      >
        {open ? "×" : "≡"}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-900 bg-black transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-neutral-900 p-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">
            ROSA · MENTA
          </p>
          <p className="mt-1 font-mono text-xs tracking-[0.2em] text-white">
            ADMIN / v1.0
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-px">
            {ITEMS.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-4 px-6 py-3 font-mono text-xs tracking-[0.15em] transition-colors ${
                      active
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-500 hover:bg-neutral-950 hover:text-white"
                    }`}
                  >
                    <span className="text-[10px] text-neutral-600">
                      [{item.code}]
                    </span>
                    <span>{item.label.toUpperCase()}</span>
                    {active ? (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D71921]" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-neutral-900 p-6">
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-600">
            SESIÓN
          </p>
          <p className="mt-1 truncate text-sm text-white">{userName}</p>
          <Link
            href="/"
            className="mt-4 block font-mono text-[10px] tracking-[0.2em] text-neutral-500 hover:text-white"
          >
            ← VOLVER A LA TIENDA
          </Link>
        </div>
      </aside>

      {open ? (
        <button
          aria-label="Cerrar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
        />
      ) : null}
    </>
  );
}
