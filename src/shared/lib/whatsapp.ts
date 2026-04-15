const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5215555555555";

export function buildWhatsappCheckoutLink(params: {
  numeroPedido: string;
  total: string | number;
  metodo?: string;
}): string {
  const msg =
    `Hola Rosa y Menta 💕, quiero confirmar mi pedido *${params.numeroPedido}* ` +
    `por un total de $${params.total} MXN` +
    (params.metodo ? ` (pago: ${params.metodo})` : "") +
    `. Me pueden compartir los datos para completar la compra, por favor.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
