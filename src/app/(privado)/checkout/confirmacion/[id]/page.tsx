import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@features/auth/actions";
import { getPedido } from "@features/checkout/api";
import { ApiError } from "@shared/lib/api";
import { formatPrice } from "@shared/lib/format";
import { buildWhatsappCheckoutLink } from "@shared/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

type Params = { id: string };

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  let pedido;
  try {
    pedido = await getPedido(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const wa = buildWhatsappCheckoutLink({
    numeroPedido: pedido.numero_pedido,
    total: pedido.total,
    metodo: pedido.metodo_pago_display || undefined,
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <p className="text-xs tracking-[0.3em] text-neutral-500">PEDIDO CREADO</p>
      <h1 className="mt-2 text-4xl text-rosa-500">¡Gracias por tu compra!</h1>
      <p className="mt-4 text-neutral-600">
        Tu pedido <strong>#{pedido.numero_pedido}</strong> fue registrado.
        Confírmalo por WhatsApp para coordinar pago y envío.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-6 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Artículos</span>
          <span className="text-neutral-900">{pedido.items.length}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span className="text-neutral-900">{formatPrice(pedido.subtotal)}</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4">
          <span className="text-neutral-900">Total</span>
          <span className="text-lg text-rosa-500">{formatPrice(pedido.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-rosa-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-rosa-600"
        >
          Confirmar por WhatsApp
        </a>
        <Link
          href="/cuenta/pedidos"
          className="rounded-full border border-neutral-300 px-8 py-3 text-sm text-neutral-800 transition hover:border-rosa-500 hover:text-rosa-500"
        >
          Ver mis pedidos
        </Link>
      </div>
    </main>
  );
}
