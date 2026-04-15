import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CancelarPedidoForm } from "@features/account/components/CancelarPedidoForm";
import { getPedido } from "@features/checkout/api";
import { ApiError } from "@shared/lib/api";
import { formatPrice } from "@shared/lib/format";
import { buildWhatsappCheckoutLink } from "@shared/lib/whatsapp";

export const metadata: Metadata = {
  title: "Detalle de pedido",
  robots: { index: false, follow: false },
};

type Params = { id: string };

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  let pedido;
  try {
    pedido = await getPedido(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const cancelable = pedido.estado === "CRE";
  const wa = buildWhatsappCheckoutLink({
    numeroPedido: pedido.numero_pedido,
    total: pedido.total,
    metodo: pedido.metodo_pago_display || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between rounded-2xl bg-white p-6">
        <div>
          <p className="text-xs tracking-[0.25em] text-neutral-500">
            PEDIDO #{pedido.numero_pedido}
          </p>
          <h2 className="mt-1 text-2xl text-rosa-500">{pedido.estado_display}</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Creado el {new Date(pedido.created_at).toLocaleString("es-MX")}
          </p>
        </div>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-rosa-500 px-5 py-2 text-sm text-white transition hover:bg-rosa-600"
        >
          WhatsApp
        </a>
      </div>

      <section className="rounded-2xl bg-white p-6">
        <h3 className="text-sm tracking-[0.25em] text-neutral-500">ARTÍCULOS</h3>
        <ul className="mt-4 divide-y divide-neutral-200">
          {pedido.items.map((it) => (
            <li key={it.id} className="flex justify-between py-3 text-sm">
              <div>
                <p className="text-neutral-900">{it.variante_str}</p>
                <p className="text-xs text-neutral-500">
                  {it.cantidad} × {formatPrice(it.precio_unitario)}
                </p>
              </div>
              <span className="text-neutral-900">{formatPrice(it.subtotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-1 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>{formatPrice(pedido.subtotal)}</span>
          </div>
          {Number(pedido.descuento) > 0 ? (
            <div className="flex justify-between text-neutral-600">
              <span>Descuento</span>
              <span>− {formatPrice(pedido.descuento)}</span>
            </div>
          ) : null}
          <div className="flex justify-between pt-2 text-lg">
            <span className="text-neutral-900">Total</span>
            <span className="text-rosa-500">{formatPrice(pedido.total)}</span>
          </div>
        </div>
      </section>

      {pedido.notas ? (
        <section className="rounded-2xl bg-white p-6">
          <h3 className="text-sm tracking-[0.25em] text-neutral-500">NOTAS</h3>
          <p className="mt-2 whitespace-pre-line text-sm text-neutral-700">{pedido.notas}</p>
        </section>
      ) : null}

      {cancelable ? (
        <section className="rounded-2xl bg-white p-6">
          <CancelarPedidoForm pedidoId={pedido.id} />
        </section>
      ) : null}
    </div>
  );
}
