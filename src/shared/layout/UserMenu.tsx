"use client";

import * as Popover from "@radix-ui/react-popover";
import { User } from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "@features/account/components/LogoutButton";

export function UserMenu({
  userName,
  isStaff = false,
}: {
  userName: string;
  isStaff?: boolean;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Menú de cuenta"
        className="flex items-center gap-2 rounded-full p-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
      >
        <User className="h-5 w-5" />
        <span className="hidden lg:inline">{userName}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg"
        >
          {isStaff ? (
            <>
              <Link
                href="/admin"
                className="block rounded-lg bg-rosa-50 px-3 py-2 text-sm font-medium text-rosa-600 hover:bg-rosa-100"
              >
                Dashboard admin
              </Link>
              <div className="my-1 border-t border-neutral-200" />
            </>
          ) : null}
          <Link href="/cuenta" className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
            Mi perfil
          </Link>
          <Link href="/cuenta/pedidos" className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
            Mis pedidos
          </Link>
          <Link href="/cuenta/direcciones" className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
            Direcciones
          </Link>
          <div className="my-1 border-t border-neutral-200" />
          <div className="px-1 py-1">
            <LogoutButton className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100" />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
