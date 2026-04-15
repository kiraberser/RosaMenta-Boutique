import Link from "next/link";

import {
  getIngresosPorMetodo,
  getVentasResumen,
  listVentas,
} from "@features/admin/api";
import { BarList } from "@features/admin/components/BarList";
import { DataTable } from "@features/admin/components/DataTable";
import { PageHeader } from "@features/admin/components/PageHeader";
import { PeriodoTabs } from "@features/admin/components/PeriodoTabs";
import { Sparkline } from "@features/admin/components/Sparkline";
import { StatCard } from "@features/admin/components/StatCard";
import type { Periodo } from "@features/admin/types";

export const dynamic = "force-dynamic";

const fmt = (v: string | number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);

function isPeriodo(v: string | undefined): v is Periodo {
  return v === "hoy" || v === "semana" || v === "mes";
}

export default async function VentasPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const sp = await searchParams;
  const periodo: Periodo = isPeriodo(sp.periodo) ? sp.periodo : "mes";

  const [resumen, ventas, metodos] = await Promise.all([
    getVentasResumen(periodo).catch(() => null),
    listVentas().catch(() => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    })),
    getIngresosPorMetodo(periodo).catch(() => null),
  ]);

  const metodoRows = metodos
    ? (() => {
        const map = new Map<string, number>();
        for (const m of [
          ...metodos.pedidos_online,
          ...metodos.ventas_directas,
        ]) {
          const key = m.metodo_pago || "—";
          map.set(key, (map.get(key) ?? 0) + Number(m.total));
        }
        return Array.from(map.entries())
          .sort(([, a], [, b]) => b - a)
          .map(([label, value]) => ({
            label,
            value: Math.round(value),
            hint: fmt(value),
          }));
      })()
    : [];

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  const csvHref = `${apiBase}/api/v1/reportes/ventas/export.csv?periodo=${periodo}`;

  // Combinar series para sparkline
  const sparkData = (() => {
    if (!resumen) return [];
    const map = new Map<string, number>();
    for (const r of resumen.pedidos_online.serie) {
      map.set(r.bucket, (map.get(r.bucket) ?? 0) + Number(r.total));
    }
    for (const r of resumen.ventas_directas.serie) {
      map.set(r.bucket, (map.get(r.bucket) ?? 0) + Number(r.total));
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([bucket, value]) => ({
        label: new Date(bucket).toLocaleDateString("es-MX"),
        value,
      }));
  })();

  return (
    <div className="space-y-10">
      <PageHeader
        code="04"
        title="Ventas"
        description="Resumen agregado y ventas directas."
        action={
          <a
            href={csvHref}
            className="inline-flex items-center gap-2 border border-neutral-700 px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] text-neutral-300 hover:border-white hover:text-white"
          >
            ↓ EXPORTAR CSV
          </a>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PeriodoTabs current={periodo} />
        {resumen ? (
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500">
            {new Date(resumen.desde).toLocaleDateString("es-MX").toUpperCase()}{" "}
            → {new Date(resumen.hasta).toLocaleDateString("es-MX").toUpperCase()}
          </p>
        ) : null}
      </div>

      {resumen ? (
        <>
          <section className="grid grid-cols-1 gap-px bg-neutral-900 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              code="01"
              label="Gran total"
              value={fmt(resumen.gran_total)}
              hint="Pedidos + directas"
            />
            <StatCard
              code="02"
              label="Pedidos online"
              value={fmt(resumen.pedidos_online.totales.total)}
              hint={`${resumen.pedidos_online.totales.n} transacciones`}
            />
            <StatCard
              code="03"
              label="Ventas directas"
              value={fmt(resumen.ventas_directas.totales.total)}
              hint={`${resumen.ventas_directas.totales.n} tickets`}
            />
          </section>

          <section className="border border-neutral-900 bg-neutral-950 p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
                EVOLUCIÓN · {periodo.toUpperCase()}
              </h2>
              <span className="font-mono text-[10px] text-neutral-700">
                [SERIE]
              </span>
            </div>
            <div className="mt-6">
              <Sparkline data={sparkData} height={140} />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-neutral-600">
              <span>{sparkData[0]?.label?.toUpperCase() ?? ""}</span>
              <span>{sparkData[sparkData.length - 1]?.label?.toUpperCase() ?? ""}</span>
            </div>
          </section>
        </>
      ) : null}

      {metodoRows.length > 0 ? (
        <section className="border border-neutral-900 bg-neutral-950 p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
              INGRESOS POR MÉTODO
            </h2>
            <span className="font-mono text-[10px] text-neutral-700">[20]</span>
          </div>
          <div className="mt-6">
            <BarList rows={metodoRows} />
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 font-mono text-xs tracking-[0.25em] text-neutral-400">
          VENTAS DIRECTAS · [12]
        </h2>
        <DataTable
          rows={ventas.results}
          empty="Sin ventas"
          columns={[
            {
              key: "ticket",
              header: "Ticket",
              render: (v) => (
                <Link
                  href={`/admin/ventas/${v.id}`}
                  className="font-mono text-xs text-white hover:text-[#D71921]"
                >
                  {v.numero_ticket}
                </Link>
              ),
            },
            {
              key: "fecha",
              header: "Fecha",
              render: (v) => (
                <span className="font-mono text-[11px] text-neutral-400">
                  {new Date(v.fecha).toLocaleString("es-MX")}
                </span>
              ),
            },
            {
              key: "cliente",
              header: "Cliente",
              render: (v) => <span className="text-sm">{v.cliente_nombre}</span>,
            },
            {
              key: "metodo",
              header: "Método",
              render: (v) => (
                <span className="font-mono text-[11px] text-neutral-400">
                  {v.metodo_pago}
                </span>
              ),
            },
            {
              key: "total",
              header: "Total",
              render: (v) => (
                <span className="font-mono text-sm text-white">
                  {fmt(v.total)}
                </span>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
