import Link from "next/link";

import { getCurrentUser } from "@features/auth/actions";
import { CartIconButton } from "@features/cart/components/CartIconButton";
import { SITE_NAME } from "@shared/lib/site";

import { MobileMenu } from "./MobileMenu";
import { UserMenu } from "./UserMenu";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?destacado=true", label: "Destacados" },
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <MobileMenu
            links={NAV_LINKS}
            isAuthed={Boolean(user)}
            userName={user?.first_name}
            isStaff={user?.is_staff ?? false}
          />
          <Link href="/" className="flex items-baseline gap-1 font-display">
            <span className="text-xl leading-none text-rosa-500 sm:text-2xl">
              {SITE_NAME.split(" ")[0]}
            </span>
            <span className="text-xs tracking-[0.25em] text-menta-400 sm:text-sm">
              {SITE_NAME.split(" ").slice(1).join(" ")}
            </span>
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-rosa-500"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          {user ? (
            <UserMenu userName={user.first_name} isStaff={user.is_staff} />
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm text-neutral-700 transition hover:text-rosa-500"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-rosa-500 px-4 py-2 text-sm text-white transition hover:bg-rosa-600"
              >
                Crear cuenta
              </Link>
            </div>
          )}
          <CartIconButton />
        </div>
      </div>
    </header>
  );
}
