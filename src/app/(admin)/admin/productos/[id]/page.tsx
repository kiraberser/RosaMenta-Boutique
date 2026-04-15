import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProductoDetalle,
  listCategorias,
  listMarcas,
} from "@features/admin/api";
import { ImagenUploader } from "@features/admin/components/ImagenUploader";
import { PageHeader } from "@features/admin/components/PageHeader";
import { ProductoEditForm } from "@features/admin/components/ProductoEditForm";
import { VariantesManager } from "@features/admin/components/VariantesManager";
import type { Categoria, Marca, Paginated } from "@features/admin/types";

export const dynamic = "force-dynamic";

function unwrap<T>(x: T[] | Paginated<T>): T[] {
  if (Array.isArray(x)) return x;
  return Array.isArray(x?.results) ? x.results : [];
}

export default async function ProductoEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [producto, cats, marcas] = await Promise.all([
    getProductoDetalle(id).catch(() => null),
    listCategorias().catch(() => [] as Categoria[]),
    listMarcas().catch(() => [] as Marca[]),
  ]);

  if (!producto) notFound();

  return (
    <div className="space-y-12">
      <PageHeader
        code={`01.${producto.id}`}
        title={producto.nombre}
        description={`SKU ${producto.sku} · ${producto.categoria.nombre} · ${producto.marca.nombre}`}
        action={
          <Link
            href="/admin/productos"
            className="font-mono text-[11px] tracking-[0.25em] text-neutral-500 hover:text-white"
          >
            ← VOLVER
          </Link>
        }
      />

      <section>
        <ImagenUploader productoId={producto.id} imagenes={producto.imagenes} />
      </section>

      <section>
        <VariantesManager
          productoId={producto.id}
          variantes={producto.variantes}
        />
      </section>

      <section className="border-t border-neutral-900 pt-8">
        <h2 className="mb-6 font-mono text-xs tracking-[0.25em] text-neutral-400">
          DATOS GENERALES · [09]
        </h2>
        <ProductoEditForm
          producto={producto}
          categorias={unwrap(cats)}
          marcas={unwrap(marcas)}
        />
      </section>
    </div>
  );
}
