import {
  ADMIN_PAGE_SIZE,
  listOrdenesCompra,
  listProveedores,
} from "@features/admin/api";
import { DataTable } from "@features/admin/components/DataTable";
import { OrdenCompraActions } from "@features/admin/components/OrdenCompraActions";
import { PageHeader } from "@features/admin/components/PageHeader";
import { Pagination } from "@features/admin/components/Pagination";
import {
  NewProveedorForm,
  ProveedorToggleForm,
} from "@features/admin/components/ProveedorForm";
import { SearchBox } from "@features/admin/components/SearchBox";
import { StatCard } from "@features/admin/components/StatCard";
import type { OrdenCompraEstado } from "@features/admin/types";

export const dynamic = "force-dynamic";

const fmt = (v: string | number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    Number(v) || 0,
  );

const ESTADO_TONE: Record<OrdenCompraEstado, string> = {
  BORRADOR: "text-[#FFB800]",
  CONFIRMADO: "text-white",
  RECIBIDO: "text-[#00C853]",
  CANCELADO: "text-[#D71921]",
};

export default async function ProveedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; estado?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search ?? "";
  const estado = sp.estado ?? "";

  const [proveedores, ordenes] = await Promise.all([
    listProveedores(page, search).catch(() => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    })),
    listOrdenesCompra(1, estado).catch(() => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    })),
  ]);

  const activos = proveedores.results.filter((p) => p.activo).length;
  const borradorCount = ordenes.results.filter(
    (o) => o.estado === "BORRADOR",
  ).length;
  const confirmadasCount = ordenes.results.filter(
    (o) => o.estado === "CONFIRMADO",
  ).length;

  return (
    <div className="space-y-10">
      <PageHeader
        code="07"
        title="Proveedores"
        description="Catálogo de proveedores y órdenes de compra."
      />

      <section className="grid grid-cols-2 gap-px bg-neutral-900 sm:grid-cols-4">
        <StatCard code="01" label="Proveedores" value={proveedores.count} />
        <StatCard
          code="02"
          label="Activos · Página"
          value={activos}
          tone="success"
        />
        <StatCard
          code="03"
          label="OC Borrador"
          value={borradorCount}
          tone={borradorCount > 0 ? "alert" : "neutral"}
        />
        <StatCard
          code="04"
          label="OC Confirmadas"
          value={confirmadasCount}
          hint="Pendientes de recibir"
        />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
            PROVEEDORES · [16]
          </h2>
          <SearchBox placeholder="Buscar por nombre, contacto..." />
        </div>

        <NewProveedorForm />

        <DataTable
          rows={proveedores.results}
          empty={search ? "Sin coincidencias" : "Sin proveedores"}
          columns={[
            {
              key: "nombre",
              header: "Nombre",
              render: (p) => (
                <div>
                  <p className="text-sm text-white">{p.nombre}</p>
                  {p.contacto ? (
                    <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-neutral-600">
                      {p.contacto}
                    </p>
                  ) : null}
                </div>
              ),
            },
            {
              key: "contacto",
              header: "Contacto",
              render: (p) => (
                <div className="space-y-1 font-mono text-[11px] text-neutral-400">
                  {p.email ? <p>{p.email}</p> : null}
                  {p.telefono ? (
                    <p className="text-neutral-600">{p.telefono}</p>
                  ) : null}
                </div>
              ),
            },
            {
              key: "estado",
              header: "Estado",
              render: (p) => (
                <span
                  className={`font-mono text-[10px] tracking-[0.25em] ${
                    p.activo ? "text-[#00C853]" : "text-neutral-500"
                  }`}
                >
                  {p.activo ? "● ACTIVO" : "○ INACTIVO"}
                </span>
              ),
            },
            {
              key: "accion",
              header: "",
              render: (p) => (
                <ProveedorToggleForm id={p.id} activo={p.activo} />
              ),
            },
          ]}
        />

        <Pagination
          page={page}
          count={proveedores.count}
          pageSize={ADMIN_PAGE_SIZE}
        />
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
          ÓRDENES DE COMPRA · [17]
        </h2>

        <DataTable
          rows={ordenes.results}
          empty="Sin órdenes de compra"
          columns={[
            {
              key: "oc",
              header: "OC",
              render: (o) => (
                <span className="font-mono text-xs text-white">
                  OC-{String(o.id).padStart(5, "0")}
                </span>
              ),
            },
            {
              key: "proveedor",
              header: "Proveedor",
              render: (o) => (
                <span className="text-sm text-neutral-200">
                  {o.proveedor_nombre}
                </span>
              ),
            },
            {
              key: "estado",
              header: "Estado",
              render: (o) => (
                <span
                  className={`font-mono text-[10px] tracking-[0.25em] ${
                    ESTADO_TONE[o.estado] ?? "text-neutral-400"
                  }`}
                >
                  ● {o.estado}
                </span>
              ),
            },
            {
              key: "items",
              header: "Items",
              render: (o) => (
                <span className="font-mono text-[11px] text-neutral-400">
                  {o.items.length}
                </span>
              ),
            },
            {
              key: "total",
              header: "Total",
              render: (o) => (
                <span className="font-mono text-sm text-white">
                  {fmt(o.total)}
                </span>
              ),
            },
            {
              key: "fecha",
              header: "Creada",
              render: (o) => (
                <span className="font-mono text-[11px] text-neutral-500">
                  {new Date(o.fecha_creacion).toLocaleDateString("es-MX")}
                </span>
              ),
            },
            {
              key: "accion",
              header: "",
              render: (o) => <OrdenCompraActions id={o.id} estado={o.estado} />,
            },
          ]}
        />
      </section>
    </div>
  );
}
