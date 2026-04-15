"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LogoutButton } from "@features/account/components/LogoutButton";

type NavLink = { href: string; label: string };

type Props = {
  links: NavLink[];
  isAuthed: boolean;
  userName?: string;
  isStaff?: boolean;
};

export function MobileMenu({ links, isAuthed, userName, isStaff = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Abrir menú"
        className="rounded-full p-2 transition hover:bg-neutral-100 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
            <Dialog.Title className="text-lg text-rosa-500">Menú</Dialog.Title>
            <Dialog.Close aria-label="Cerrar" className="rounded-full p-2 hover:bg-neutral-100">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </header>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-neutral-200" />

            {isAuthed ? (
              <ul className="space-y-1">
                {isStaff ? (
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl bg-rosa-50 px-4 py-3 text-sm font-medium text-rosa-600 hover:bg-rosa-100"
                    >
                      Dashboard admin
                    </Link>
                  </li>
                ) : null}
                <li>
                  <Link
                    href="/cuenta"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    {userName ? `Hola, ${userName}` : "Mi cuenta"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cuenta/pedidos"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Mis pedidos
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="space-y-2 px-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-full border border-neutral-300 px-5 py-2.5 text-center text-sm text-neutral-800 transition hover:border-rosa-500"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-rosa-500 px-5 py-2.5 text-center text-sm text-white transition hover:bg-rosa-600"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </nav>

          {isAuthed ? (
            <footer className="border-t border-neutral-200 p-4">
              <LogoutButton className="w-full rounded-full border border-neutral-300 px-5 py-2.5 text-sm text-neutral-700 transition hover:border-rosa-500 hover:text-rosa-500" />
            </footer>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
