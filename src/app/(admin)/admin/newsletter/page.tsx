import {
  ADMIN_PAGE_SIZE,
  getNewsletterMetrics,
  listSuscriptores,
} from "@features/admin/api";
import { BarList } from "@features/admin/components/BarList";
import { DataTable } from "@features/admin/components/DataTable";
import { PageHeader } from "@features/admin/components/PageHeader";
import { Pagination } from "@features/admin/components/Pagination";
import { SearchBox } from "@features/admin/components/SearchBox";
import { StatCard } from "@features/admin/components/StatCard";

export const dynamic = "force-dynamic";

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search ?? "";

  const [metrics, subs] = await Promise.all([
    getNewsletterMetrics().catch(() => null),
    listSuscriptores(page, search).catch(() => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    })),
  ]);

  const origenRows =
    metrics?.por_origen.map((o) => ({
      label: o.origen || "—",
      value: o.total,
      hint: metrics.activos
        ? `${Math.round((o.total / metrics.activos) * 100)}%`
        : undefined,
    })) ?? [];

  return (
    <div className="space-y-10">
      <PageHeader
        code="05"
        title="Newsletter"
        description="Suscriptores activos y métricas del mes."
      />

      {metrics ? (
        <section className="grid grid-cols-2 gap-px bg-neutral-900 sm:grid-cols-4">
          <StatCard code="01" label="Activos" value={metrics.activos} tone="success" />
          <StatCard code="02" label="Inactivos" value={metrics.inactivos} />
          <StatCard
            code="03"
            label="Altas · Mes"
            value={metrics.altas_mes}
            hint="MTD"
          />
          <StatCard
            code="04"
            label="Bajas · Mes"
            value={metrics.bajas_mes}
            tone={metrics.bajas_mes > 0 ? "alert" : "neutral"}
            hint="MTD"
          />
        </section>
      ) : null}

      {origenRows.length > 0 ? (
        <section className="border border-neutral-900 bg-neutral-950 p-6">
          <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
            POR ORIGEN · [13]
          </h2>
          <div className="mt-6">
            <BarList rows={origenRows} unit="subs" />
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
            SUSCRIPTORES · [14]
          </h2>
          <SearchBox placeholder="Buscar por email..." />
        </div>

        <DataTable
          rows={subs.results}
          empty={search ? "Sin coincidencias" : "Sin suscriptores"}
          columns={[
            {
              key: "email",
              header: "Email",
              render: (s) => <span className="text-sm text-white">{s.email}</span>,
            },
            {
              key: "origen",
              header: "Origen",
              render: (s) => (
                <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400">
                  {s.origen?.toUpperCase?.() ?? "—"}
                </span>
              ),
            },
            {
              key: "fecha",
              header: "Alta",
              render: (s) => (
                <span className="font-mono text-[11px] text-neutral-500">
                  {new Date(s.fecha_suscripcion).toLocaleDateString("es-MX")}
                </span>
              ),
            },
            {
              key: "activo",
              header: "Estado",
              render: (s) => (
                <span
                  className={`font-mono text-[10px] tracking-[0.2em] ${
                    s.activo ? "text-[#00C853]" : "text-neutral-500"
                  }`}
                >
                  {s.activo ? "● ACTIVO" : "○ BAJA"}
                </span>
              ),
            },
          ]}
        />

        <Pagination page={page} count={subs.count} pageSize={ADMIN_PAGE_SIZE} />
      </section>
    </div>
  );
}
