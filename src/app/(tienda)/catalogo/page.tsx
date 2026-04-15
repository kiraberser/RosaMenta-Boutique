import type { Metadata } from "next";
import { Suspense } from "react";

import {
  breadcrumbJsonLd,
  jsonLdScript,
  ogImageUrl,
} from "@shared/lib/metadata";

import {
  getCategorias,
  getMarcas,
  getProductos,
} from "@features/catalog/api";
import { CatalogoFiltros } from "@features/catalog/components/CatalogoFiltros";
import { Pagination } from "@features/catalog/components/Pagination";
import { ProductGrid } from "@features/catalog/components/ProductGrid";
import { SearchInput } from "@features/catalog/components/SearchInput";
import type { CatalogoFilters, EstadoProducto } from "@features/catalog/types";

const CATALOGO_DESC = "Explora prendas y accesorios seleccionados por Rosa y Menta.";
const CATALOGO_OG = ogImageUrl({ title: "Catálogo", eyebrow: "Boutique" });

export const metadata: Metadata = {
  title: "Catálogo",
  description: CATALOGO_DESC,
  openGraph: {
    title: "Catálogo | Rosa y Menta",
    description: CATALOGO_DESC,
    images: [{ url: CATALOGO_OG, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo | Rosa y Menta",
    images: [CATALOGO_OG],
  },
};

type SearchParams = {
  categoria?: string;
  marca?: string;
  estado?: string;
  search?: string;
  ordering?: string;
  page?: string;
};

function parseFilters(sp: SearchParams): CatalogoFilters {
  const page = Number(sp.page ?? "1") || 1;
  const ordering = (["precio", "-precio", "-created_at", "created_at"].includes(
    sp.ordering ?? "",
  )
    ? (sp.ordering as CatalogoFilters["ordering"])
    : undefined);
  const estado = (["NUE", "USA", "REA"].includes(sp.estado ?? "")
    ? (sp.estado as EstadoProducto)
    : undefined);
  return {
    categoria: sp.categoria,
    marca: sp.marca,
    estado,
    search: sp.search,
    ordering,
    page,
  };
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  const [data, categorias, marcas] = await Promise.all([
    getProductos(filters),
    getCategorias(),
    getMarcas(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "Inicio", href: "/" },
              { name: "Catálogo", href: "/catalogo" },
            ]),
          ),
        }}
      />
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-neutral-500">BOUTIQUE</p>
        <h1 className="mt-2 text-4xl text-rosa-500">Catálogo</h1>
        <p className="mt-2 max-w-xl text-neutral-600">
          {data.count} piezas disponibles.
        </p>
      </header>

      <div className="mb-8">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <Suspense fallback={null}>
          <CatalogoFiltros categorias={categorias} marcas={marcas} />
        </Suspense>

        <section>
          <ProductGrid productos={data.results} />
          <Suspense fallback={null}>
            <Pagination count={data.count} page={filters.page ?? 1} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
