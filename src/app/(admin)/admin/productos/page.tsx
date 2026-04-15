import Link from "next/link";
import Image from "next/image";

import { ADMIN_PAGE_SIZE, listProductos } from "@features/admin/api";
import { DataTable } from "@features/admin/components/DataTable";
import { PageHeader } from "@features/admin/components/PageHeader";
import { Pagination } from "@features/admin/components/Pagination";
import { SearchBox } from "@features/admin/components/SearchBox";

export const dynamic = "force-dynamic";

function fmt(v: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(v) || 0);
}

function catName(c: unknown): string {
  if (typeof c === "string") return c;
  if (c && typeof c === "object" && "nombre" in c)
    return String((c as { nombre: string }).nombre);
  return "—";
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search ?? "";

  const data = await listProductos(page, search).catch(() => ({
    results: [],
    count: 0,
    next: null,
    previous: null,
  }));

  return (
    <div className="space-y-10">
      <PageHeader
        code="01"
        title="Productos"
        description={`${data.count} productos registrados.`}
        action={
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 border border-white px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] text-white transition hover:bg-white hover:text-black"
          >
            + NUEVO
          </Link>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox placeholder="Buscar por nombre o SKU..." />
        {search ? (
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500">
            FILTRO: &quot;{search.toUpperCase()}&quot;
          </p>
        ) : null}
      </div>

      <DataTable
        rows={data.results}
        empty={search ? "Sin coincidencias" : "Sin productos"}
        columns={[
          {
            key: "imagen",
            header: "Imagen",
            render: (p) =>
              p.imagen_principal ? (
                <div className="h-12 w-12 overflow-hidden border border-neutral-800 bg-neutral-950">
                  <Image
                    src={p.imagen_principal}
                    alt={p.nombre}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center border border-dashed border-neutral-800 bg-neutral-950 font-mono text-[9px] tracking-[0.2em] text-neutral-600">
                  SIN IMG
                </div>
              ),
          },
          {
            key: "sku",
            header: "SKU",
            render: (p) => (
              <span className="font-mono text-xs text-neutral-400">{p.sku}</span>
            ),
          },
          {
            key: "nombre",
            header: "Producto",
            render: (p) => (
              <Link
                href={`/admin/productos/${p.id}`}
                className="block hover:text-[#D71921]"
              >
                <p className="text-sm text-white">{p.nombre}</p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-neutral-600">
                  {catName(p.categoria).toUpperCase()} ·{" "}
                  {catName(p.marca).toUpperCase()}
                </p>
              </Link>
            ),
          },
          {
            key: "precio",
            header: "Precio",
            render: (p) => (
              <span className="font-mono text-sm">{fmt(p.precio_final)}</span>
            ),
          },
          {
            key: "activo",
            header: "Estado",
            render: (p) => (
              <span
                className={`font-mono text-[10px] tracking-[0.2em] ${
                  p.activo ? "text-[#00C853]" : "text-neutral-500"
                }`}
              >
                {p.activo ? "● ACTIVO" : "○ BORRADOR"}
              </span>
            ),
          },
        ]}
      />

      <Pagination page={page} count={data.count} pageSize={ADMIN_PAGE_SIZE} />
    </div>
  );
}
