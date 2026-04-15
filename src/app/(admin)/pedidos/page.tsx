import Link from "next/link";

import { ADMIN_PAGE_SIZE, listPedidos } from "@features/admin/api";
import { DataTable } from "@features/admin/components/DataTable";
import { DateRangeFilter } from "@features/admin/components/DateRangeFilter";
import { PageHeader } from "@features/admin/components/PageHeader";
import { Pagination } from "@features/admin/components/Pagination";
import { SearchBox } from "@features/admin/components/SearchBox";

export const dynamic = "force-dynamic";

const fmt = (v: string | number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    Number(v) || 0,
  );

const ESTADO_TONE: Record<string, string> = {
  CREADO: "text-[#FFB800]",
  PAGADO: "text-[#00C853]",
  ENVIADO: "text-white",
  ENTREGADO: "text-neutral-400",
  CANCELADO: "text-[#D71921]",
};

const FILTROS = ["", "CREADO", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"];

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    estado?: string;
    search?: string;
    desde?: string;
    hasta?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const estado = sp.estado ?? "";
  const search = sp.search ?? "";
  const desde = sp.desde ?? "";
  const hasta = sp.hasta ?? "";

  const data = await listPedidos(page, estado, { search, desde, hasta }).catch(
    () => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    }),
  );

  const buildHref = (nextEstado: string) => {
    const q = new URLSearchParams();
    if (nextEstado) q.set("estado", nextEstado);
    if (search) q.set("search", search);
    if (desde) q.set("desde", desde);
    if (hasta) q.set("hasta", hasta);
    return `/admin/pedidos${q.toString() ? `?${q.toString()}` : ""}`;
  };

  const activeFilters = [
    estado && `estado ${estado}`,
    search && `búsqueda "${search}"`,
    (desde || hasta) && `rango ${desde || "…"} → ${hasta || "…"}`,
  ].filter(Boolean);

  return (
    <div className="space-y-10">
      <PageHeader
        code="03"
        title="Pedidos"
        description={`${data.count} pedidos${activeFilters.length ? ` · ${activeFilters.join(" · ")}` : ""}.`}
      />

      <div className="space-y-4">
        <nav className="flex flex-wrap gap-2">
          {FILTROS.map((f) => {
            const active = estado === f;
            return (
              <Link
                key={f || "todos"}
                href={buildHref(f)}
                className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
                }`}
              >
                {f || "TODOS"}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox placeholder="Buscar por número..." />
          <DateRangeFilter />
        </div>
      </div>

      <DataTable
        rows={data.results}
        empty={activeFilters.length ? "Sin coincidencias" : "Sin pedidos"}
        columns={[
          {
            key: "numero",
            header: "Número",
            render: (p) => (
              <Link
                href={`/admin/pedidos/${p.id}`}
                className="font-mono text-xs text-white hover:text-[#D71921]"
              >
                {p.numero_pedido}
              </Link>
            ),
          },
          {
            key: "fecha",
            header: "Fecha",
            render: (p) => (
              <span className="font-mono text-[11px] text-neutral-400">
                {new Date(p.created_at).toLocaleDateString("es-MX")}
              </span>
            ),
          },
          {
            key: "estado",
            header: "Estado",
            render: (p) => (
              <span
                className={`font-mono text-[10px] tracking-[0.25em] ${
                  ESTADO_TONE[p.estado] ?? "text-neutral-400"
                }`}
              >
                ● {p.estado}
              </span>
            ),
          },
          {
            key: "metodo",
            header: "Pago",
            render: (p) => (
              <span className="font-mono text-[11px] text-neutral-400">
                {p.metodo_pago ?? "—"}
              </span>
            ),
          },
          {
            key: "total",
            header: "Total",
            render: (p) => (
              <span className="font-mono text-sm text-white">
                {fmt(p.total)}
              </span>
            ),
          },
        ]}
      />

      <Pagination page={page} count={data.count} pageSize={ADMIN_PAGE_SIZE} />
    </div>
  );
}
