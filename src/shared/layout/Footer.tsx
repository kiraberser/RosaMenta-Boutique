import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

import { NewsletterForm } from "@features/newsletter/components/NewsletterForm";
import { SITE_NAME } from "@shared/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl text-rosa-500">{SITE_NAME}</p>
            <p className="mt-3 max-w-xs text-sm text-neutral-600">
              Moda y accesorios seleccionados con cariño. Envíos a todo México.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="https://www.instagram.com/rosaymenta_boutique/"
                aria-label="Instagram"
                className="rounded-full border border-neutral-300 p-2 transition hover:border-rosa-500 hover:text-rosa-500"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="rounded-full border border-neutral-300 p-2 transition hover:border-rosa-500 hover:text-rosa-500"
              >
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <nav aria-label="Tienda">
            <h3 className="text-xs tracking-[0.25em] text-neutral-500">TIENDA</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/catalogo" className="text-neutral-700 hover:text-rosa-500">Catálogo</Link></li>
              <li><Link href="/catalogo?destacado=true" className="text-neutral-700 hover:text-rosa-500">Destacados</Link></li>
              <li><Link href="/cuenta/pedidos" className="text-neutral-700 hover:text-rosa-500">Mis pedidos</Link></li>
            </ul>
          </nav>

          <nav aria-label="Cuenta">
            <h3 className="text-xs tracking-[0.25em] text-neutral-500">CUENTA</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/login" className="text-neutral-700 hover:text-rosa-500">Iniciar sesión</Link></li>
              <li><Link href="/registro" className="text-neutral-700 hover:text-rosa-500">Crear cuenta</Link></li>
              <li><Link href="/cuenta" className="text-neutral-700 hover:text-rosa-500">Mi perfil</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="text-xs tracking-[0.25em] text-neutral-500">NEWSLETTER</h3>
            <p className="mt-4 text-sm text-neutral-600">
              Recibe promos y lanzamientos antes que nadie.
            </p>
            <div className="mt-4">
              <NewsletterForm origen="FOR" variant="stacked" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>© {year} {SITE_NAME}. Todos los derechos reservados.</p>
          <p>Hecho con cariño en México 🇲🇽</p>
        </div>
      </div>
    </footer>
  );
}
