import { getCategorias, getDestacados } from "@features/catalog/api";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@shared/lib/site";

export const revalidate = 3600;

export async function GET() {
  const [categorias, destacados] = await Promise.all([
    getCategorias().catch(() => []),
    getDestacados(8).catch(() => []),
  ]);

  const topCats = categorias.filter((c) => c.padre == null).slice(0, 12);

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Boutique mexicana de ropa y accesorios. Tienda e-commerce con checkout por WhatsApp y pago por transferencia o efectivo.",
    "",
    "## Secciones principales",
    "",
    `- [Inicio](${SITE_URL}/)`,
    `- [Catálogo completo](${SITE_URL}/catalogo)`,
    `- [Destacados](${SITE_URL}/catalogo?destacado=true)`,
    `- [Crear cuenta](${SITE_URL}/registro)`,
    `- [Iniciar sesión](${SITE_URL}/login)`,
    "",
    "## Categorías",
    "",
    ...(topCats.length
      ? topCats.map((c) => `- [${c.nombre}](${SITE_URL}/catalogo?categoria=${c.id})`)
      : ["- (Sin categorías publicadas aún)"]),
    "",
    "## Destacados actuales",
    "",
    ...(destacados.length
      ? destacados.map(
          (p) => `- [${p.nombre}](${SITE_URL}/catalogo/producto/${p.id}) — $${p.precio_final} MXN`,
        )
      : ["- (Sin productos destacados)"]),
    "",
    "## Políticas",
    "",
    "- Envíos a todo México. Envío gratis en CDMX desde $999 MXN.",
    "- Pago por transferencia bancaria o efectivo al recibir.",
    "- Confirmación final del pedido por WhatsApp.",
    "- Cuentas limitadas a 3 direcciones por usuario.",
    "",
    "## Contacto",
    "",
    `- Sitio: ${SITE_URL}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
