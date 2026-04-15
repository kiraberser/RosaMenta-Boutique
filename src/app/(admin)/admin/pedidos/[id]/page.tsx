import Link from "next/link";
import { notFound } from "next/navigation";

import { getPedidoDetalle } from "@features/admin/api";
import { PageHeader } from "@features/admin/components/PageHeader";
import { PedidoEstadoForm } from "@features/admin/components/PedidoEstadoForm";
import { StatCard } from "@features/admin/components/StatCard";

export const dynamic = "force-dynamic";

const fmt = (v: string | number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(v) || 0);

const ESTADO_TONE: Record<string, string> = {
  CREADO: "text-[#FFB800]",
  PAGADO: "text-[#00C853]",
  ENVIADO: "text-white",
  ENTREGADO: "text-neutral-400",
  CANCELADO: "text-[#D71921]",
};

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = await getPedidoDetalle(id).catch(() => null);
  if (!pedido) notFound();

  return (
    <div className="space-y-10">
      <PageHeader
        code={`03.${pedido.id}`}
        title={pedido.numero_pedido}
        description={`${new Date(pedido.created_at).toLocaleString("es-MX")} · ${
          pedido.usuario.email
        }`}
        action={
          <Link
            href="/admin/pedidos"
            className="font-mono text-[11px] tracking-[0.25em] text-neutral-500 hover:text-white"
          >
            ← VOLVER
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-px bg-neutral-900 sm:grid-cols-3">
        <StatCard
          code="01"
          label="Estado"
          value={pedido.estado}
          tone={
            pedido.estado === "CANCELADO"
              ? "alert"
              : pedido.estado === "PAGADO" || pedido.estado === "ENTREGADO"
                ? "success"
                : "neutral"
          }
        />
        <StatCard code="02" label="Total" value={fmt(pedido.total)} />
        <StatCard
          code="03"
          label="Pago"
          value={pedido.metodo_pago ?? "—"}
        />
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs tracking-[0.25em] text-neutral-400">
          ACTUALIZAR ESTADO · [15]
        </h2>
        <PedidoEstadoForm pedidoId={pedido.id} actual={pedido.estado} />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-neutral-900 bg-neutral-950 p-6">
          <h3 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
            CLIENTE · [16]
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.25em] text-neutral-600">
                USUARIO
              </dt>
              <dd className="mt-1 text-white">{pedido.usuario.username}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.25em] text-neutral-600">
                EMAIL
              </dt>
              <dd className="mt-1 font-mono text-xs text-neutral-300">
                {pedido.usuario.email}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-neutral-900 bg-neutral-950 p-6">
          <h3 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
            ENVÍO · [17]
          </h3>
          {pedido.direccion ? (
            <address className="mt-4 space-y-1 text-sm not-italic text-neutral-200">
              <p>{pedido.direccion.calle}</p>
              <p className="text-neutral-400">
                {pedido.direccion.ciudad}, {pedido.direccion.estado}{" "}
                {pedido.direccion.cp}
              </p>
            </address>
          ) : (
            <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-neutral-600">
              [SIN DIRECCIÓN]
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs tracking-[0.25em] text-neutral-400">
          ITEMS · [18]
        </h2>
        <div className="overflow-x-auto border border-neutral-900">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-950">
              <tr>
                {["Variante", "Cant.", "Unitario", "Subtotal"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-neutral-900 px-4 py-3 text-left font-mono text-[10px] tracking-[0.25em] text-neutral-500"
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((it) => (
                <tr
                  key={it.id}
                  className="border-b border-neutral-900 last:border-0"
                >
                  <td className="px-4 py-3 text-white">{it.variante_str}</td>
                  <td className="px-4 py-3 font-mono text-neutral-300">
                    {it.cantidad}
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-400">
                    {fmt(it.precio_unitario)}
                  </td>
                  <td className="px-4 py-3 font-mono text-white">
                    {fmt(it.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-950">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-right font-mono text-[10px] tracking-[0.25em] text-neutral-500"
                >
                  SUBTOTAL
                </td>
                <td className="px-4 py-3 font-mono text-neutral-300">
                  {fmt(pedido.subtotal)}
                </td>
              </tr>
              <tr className="bg-neutral-950">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-right font-mono text-[10px] tracking-[0.25em] text-neutral-500"
                >
                  DESCUENTO
                </td>
                <td className="px-4 py-3 font-mono text-neutral-300">
                  -{fmt(pedido.descuento)}
                </td>
              </tr>
              <tr className="border-t border-neutral-900 bg-neutral-950">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-right font-mono text-xs tracking-[0.25em] text-white"
                >
                  TOTAL
                </td>
                <td className={`px-4 py-3 font-mono text-lg ${ESTADO_TONE[pedido.estado] ?? "text-white"}`}>
                  {fmt(pedido.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {pedido.notas ? (
        <section className="border border-neutral-900 bg-neutral-950 p-6">
          <h3 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
            NOTAS · [19]
          </h3>
          <p className="mt-3 whitespace-pre-line text-sm text-neutral-300">
            {pedido.notas}
          </p>
        </section>
      ) : null}
    </div>
  );
}
