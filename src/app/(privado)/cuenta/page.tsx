import type { Metadata } from "next";

import { getCurrentUser } from "@features/auth/actions";

export const metadata: Metadata = {
  title: "Mi perfil",
  robots: { index: false, follow: false },
};

export default async function CuentaPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="rounded-2xl bg-white p-6">
      <h2 className="text-lg text-rosa-500">Datos personales</h2>
      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs tracking-[0.25em] text-neutral-500">NOMBRE</dt>
          <dd className="mt-1 text-sm text-neutral-900">
            {user.first_name} {user.last_name}
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.25em] text-neutral-500">CORREO</dt>
          <dd className="mt-1 text-sm text-neutral-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.25em] text-neutral-500">TELÉFONO</dt>
          <dd className="mt-1 text-sm text-neutral-900">
            {user.phone || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.25em] text-neutral-500">NEWSLETTER</dt>
          <dd className="mt-1 text-sm text-neutral-900">
            {user.acepta_newsletter ? "Suscrita" : "No suscrita"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
