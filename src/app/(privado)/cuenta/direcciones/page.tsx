import type { Metadata } from "next";

import { DireccionCard } from "@features/direcciones/components/DireccionCard";
import { DireccionForm } from "@features/direcciones/components/DireccionForm";
import { listDirecciones } from "@features/direcciones/api";

export const metadata: Metadata = {
  title: "Mis direcciones",
  robots: { index: false, follow: false },
};

export default async function DireccionesPage() {
  const direcciones = await listDirecciones();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg text-rosa-500">Direcciones guardadas</h2>
        <p className="mt-1 text-xs text-neutral-500">Máximo 3 direcciones por cuenta.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {direcciones.length === 0 ? (
            <p className="text-sm text-neutral-500">Aún no tienes direcciones.</p>
          ) : (
            direcciones.map((d) => <DireccionCard key={d.id} direccion={d} />)
          )}
        </div>
      </section>

      {direcciones.length < 3 ? <DireccionForm /> : null}
    </div>
  );
}
