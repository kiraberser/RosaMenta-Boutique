import Link from "next/link";
import { notFound } from "next/navigation";

import { getVentaDetalle } from "@features/admin/api";
import { DataTable } from "@features/admin/components/DataTable";
import { PageHeader } from "@features/admin/components/PageHeader";
import { StatCard } from "@features/admin/components/StatCard";
import { ApiError } from "@shared/lib/api";

export const dynamic = "force-dynamic";

const fmt = (v: string | number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    Number(v) || 0,
  );

export default async function VentaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let venta;
  try {
    venta = await getVentaDetalle(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  const ticketHref = `${apiBase}/api/v1/ventas/${venta.id}/ticket/`;

  return (
    <div className="space-y-10">
      <PageHeader
        code="04/T"
        title={venta.numero_ticket}
        description={`Venta directa · ${new Date(venta.fecha).toLocaleString("es-MX")}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/ventas"
              className="inline-flex items-center gap-2 border border-neutral-700 px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] text-neutral-300 hover:border-white hover:text-white"
            >
              ← VOLVER
            </Link>
            <a
              href={ticketHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] text-white hover:bg-white hover:text-black"
            >
              ↗ TICKET
            </a>
          </div>
        }
      />

      <section className="grid grid-cols-2 gap-px bg-neutral-900 sm:grid-cols-4">
        <StatCard code="01" label="Subtotal" value={fmt(venta.subtotal)} />
        <StatCard
          code="02"
          label="Descuento"
          value={fmt(venta.descuento)}
          tone={Number(venta.descuento) > 0 ? "alert" : "neutral"}
        />
        <StatCard
          code="03"
          label="Total"
          value={fmt(venta.total)}
          tone="success"
        />
        <StatCard
          code="04"
          label="Método"
          value={venta.metodo_pago_display}
          hint={venta.metodo_pago}
        />
      </section>

      <section className="grid grid-cols-1 gap-px bg-neutral-900 sm:grid-cols-2">
        <div className="bg-black p-6">
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500">
            CLIENTE
          </p>
          <p className="mt-2 text-sm text-white">
            {venta.cliente_nombre || "— Mostrador —"}
          </p>
        </div>
        <div className="bg-black p-6">
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500">
            VENDEDOR
          </p>
          <p className="mt-2 text-sm text-white">
            @{venta.vendedor_username}
          </p>
        </div>
      </section>

      {venta.notas ? (
        <section className="border border-neutral-900 bg-neutral-950 p-6">
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500">
            NOTAS
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-200">
            {venta.notas}
          </p>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
          ITEMS · [{String(venta.items.length).padStart(2, "0")}]
        </h2>
        <DataTable
          rows={venta.items}
          empty="Sin items"
          columns={[
            {
              key: "producto",
              header: "Producto",
              render: (i) => (
                <div>
                  <p className="text-sm text-white">{i.variante_str}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-neutral-600">
                    {i.sku_variante}
                  </p>
                </div>
              ),
            },
            {
              key: "cantidad",
              header: "Cant.",
              render: (i) => (
                <span className="font-mono text-sm text-white">
                  ×{i.cantidad}
                </span>
              ),
            },
            {
              key: "precio",
              header: "P. Unit.",
              render: (i) => (
                <span className="font-mono text-[11px] text-neutral-400">
                  {fmt(i.precio_unitario)}
                </span>
              ),
            },
            {
              key: "subtotal",
              header: "Subtotal",
              render: (i) => (
                <span className="font-mono text-sm text-white">
                  {fmt(i.subtotal)}
                </span>
              ),
            },
          ]}
        />

        <div className="flex flex-col gap-2 border-t border-neutral-900 pt-4 font-mono text-xs sm:items-end">
          <div className="flex w-full justify-between sm:w-64">
            <span className="tracking-[0.2em] text-neutral-500">SUBTOTAL</span>
            <span className="text-neutral-200">{fmt(venta.subtotal)}</span>
          </div>
          <div className="flex w-full justify-between sm:w-64">
            <span className="tracking-[0.2em] text-neutral-500">DESCUENTO</span>
            <span className="text-[#D71921]">-{fmt(venta.descuento)}</span>
          </div>
          <div className="flex w-full justify-between border-t border-neutral-800 pt-2 sm:w-64">
            <span className="tracking-[0.25em] text-white">TOTAL</span>
            <span className="text-base text-white">{fmt(venta.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
