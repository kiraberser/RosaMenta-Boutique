import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiError } from "@shared/lib/api";
import { formatPrice } from "@shared/lib/format";
import { breadcrumbJsonLd, jsonLdScript, ogImageUrl } from "@shared/lib/metadata";
import { SITE_NAME, SITE_URL } from "@shared/lib/site";
import { productoHref } from "@shared/lib/slug";

import { getProducto } from "@features/catalog/api";
import { ProductBuyBox } from "@features/catalog/components/ProductBuyBox";
import { ProductGallery } from "@features/catalog/components/ProductGallery";

type Params = { categoria: string; slug: string };

async function loadProducto(slug: string) {
  try {
    return await getProducto(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await loadProducto(slug);
  if (!producto) return { title: "Producto no encontrado" };

  const productImage =
    producto.imagenes.find((i) => i.es_principal)?.imagen_url ??
    producto.imagenes[0]?.imagen_url;
  const ogImage = ogImageUrl({
    title: producto.nombre,
    eyebrow: producto.categoria.nombre,
  });
  const description = producto.descripcion.slice(0, 160);

  return {
    title: producto.nombre,
    description,
    alternates: { canonical: `${SITE_URL}${productoHref({ id: producto.id, categoria: producto.categoria.nombre })}` },
    openGraph: {
      title: producto.nombre,
      description,
      type: "article",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: producto.nombre },
        ...(productImage ? [{ url: productImage }] : []),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: producto.nombre,
      description,
      images: [ogImage],
    },
  };
}

function productJsonLd(p: Awaited<ReturnType<typeof getProducto>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    sku: p.sku,
    description: p.descripcion,
    brand: { "@type": "Brand", name: p.marca.nombre },
    category: p.categoria.nombre,
    image: p.imagenes.map((i) => i.imagen_url),
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      price: p.precio_final,
      availability: p.activo
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/catalogo/producto/${p.id}`,
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const producto = await loadProducto(slug);
  if (!producto) notFound();

  const hasDiscount =
    producto.precio_descuento != null &&
    Number(producto.precio_descuento) < Number(producto.precio);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd(producto)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "Inicio", href: "/" },
              { name: "Catálogo", href: "/catalogo" },
              {
                name: producto.categoria.nombre,
                href: `/catalogo?categoria=${producto.categoria.id}`,
              },
              {
                name: producto.nombre,
                href: productoHref({
                  id: producto.id,
                  categoria: producto.categoria.nombre,
                }),
              },
            ]),
          ),
        }}
      />

      <nav
        aria-label="Ruta de navegación"
        className="mb-6 text-xs text-neutral-500"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li><a href="/" className="hover:text-rosa-500">Inicio</a></li>
          <li aria-hidden>/</li>
          <li><a href="/catalogo" className="hover:text-rosa-500">Catálogo</a></li>
          <li aria-hidden>/</li>
          <li>
            <a
              href={`/catalogo?categoria=${producto.categoria.id}`}
              className="hover:text-rosa-500"
            >
              {producto.categoria.nombre}
            </a>
          </li>
          <li aria-hidden>/</li>
          <li className="text-neutral-800">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery imagenes={producto.imagenes} alt={producto.nombre} />

        <section>
          <p className="text-xs tracking-[0.3em] text-neutral-500">
            {producto.categoria.nombre.toUpperCase()} · {producto.marca.nombre.toUpperCase()}
          </p>
          <h1 className="mt-2 text-4xl text-rosa-500">{producto.nombre}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl text-neutral-900">
              {formatPrice(producto.precio_final)}
            </span>
            {hasDiscount ? (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(producto.precio)}
              </span>
            ) : null}
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
            {producto.descripcion}
          </p>

          <ProductBuyBox producto={producto} />

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
            <div>
              <dt className="tracking-[0.25em]">SKU</dt>
              <dd className="mt-1 text-neutral-800">{producto.sku}</dd>
            </div>
            <div>
              <dt className="tracking-[0.25em]">ESTADO</dt>
              <dd className="mt-1 text-neutral-800">
                {producto.estado === "NUE" ? "Nuevo" : producto.estado === "USA" ? "Usado" : "Reacondicionado"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
