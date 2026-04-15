import type { Metadata } from "next";
import Link from "next/link";

import { listMisPedidos } from "@features/account/api/pedidos";
import { formatPrice } from "@shared/lib/format";

export const metadata: Metadata = {
  title: "Mis pedidos",
  robots: { index: false, follow: false },
};

const ESTADO_STYLES: Record<string, string> = {
  CRE: "bg-neutral-100 text-neutral-700",
  PAG: "bg-menta-50 text-menta-400",
  ENV: "bg-blue-50 text-blue-600",
  ENT: "bg-green-50 text-green-600",
  CAN: "bg-red-50 text-red-600",
};

export default async function PedidosPage() {
  const pedidos = await listMisPedidos();

  if (pedidos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
        Aún no tienes pedidos.{" "}
        <Link href="/catalogo" className="text-rosa-500 hover:underline">
          Ver catálogo →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pedidos.map((p) => (
        <Link
          key={p.id}
          href={`/cuenta/pedidos/${p.id}`}
          className="flex items-center justify-between rounded-2xl bg-white p-5 transition hover:shadow-sm"
        >
          <div>
            <p className="text-sm text-neutral-900">#{p.numero_pedido}</p>
            <p className="text-xs text-neutral-500">
              {new Date(p.created_at).toLocaleDateString("es-MX")} · {p.items.length} artículos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-[10px] tracking-wider ${ESTADO_STYLES[p.estado] ?? "bg-neutral-100 text-neutral-700"}`}
            >
              {p.estado_display.toUpperCase()}
            </span>
            <span className="text-sm text-rosa-500">{formatPrice(p.total)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
