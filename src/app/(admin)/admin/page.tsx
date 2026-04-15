import { getDashboard, getStockBajo } from "@features/admin/api";
import { PageHeader } from "@features/admin/components/PageHeader";
import { StatCard } from "@features/admin/components/StatCard";

export const dynamic = "force-dynamic";

function fmtMoney(v: number | string): string {
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return "$0";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function AdminHome() {
  const [data, stock] = await Promise.all([
    getDashboard().catch(() => null),
    getStockBajo().catch(() => ({ total: 0, items: [] })),
  ]);

  if (!data) {
    return (
      <div className="py-32 text-center font-mono text-xs tracking-[0.3em] text-neutral-500">
        [ERROR · NO DATA]
      </div>
    );
  }

  const fecha = new Date(data.fecha);
  const fechaLbl = fecha.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-12">
      <PageHeader
        code="00"
        title="Dashboard"
        description="Resumen operativo en tiempo real."
        action={
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500">
              FECHA
            </p>
            <p className="mt-1 font-mono text-xs text-neutral-300">
              {fechaLbl.toUpperCase()}
            </p>
          </div>
        }
      />

      {/* KPIs principales */}
      <section className="grid grid-cols-1 gap-px bg-neutral-900 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          code="01"
          label="Ventas · Hoy"
          value={fmtMoney(data.ventas_hoy.total)}
          hint={`${data.ventas_hoy.transacciones} transacciones`}
        />
        <StatCard
          code="02"
          label="Ventas · Mes"
          value={fmtMoney(data.ventas_mes.total)}
          hint="Acumulado MTD"
        />
        <StatCard
          code="03"
          label="Pedidos pendientes"
          value={data.pedidos_pendientes}
          tone={data.pedidos_pendientes > 0 ? "alert" : "neutral"}
          hint={data.pedidos_pendientes > 0 ? "Requieren acción" : "Todo al día"}
        />
        <StatCard
          code="04"
          label="Stock bajo"
          value={data.stock_bajo}
          tone={data.stock_bajo > 0 ? "alert" : "success"}
          hint={data.stock_bajo > 0 ? "Variantes afectadas" : "OK"}
        />
        <StatCard
          code="05"
          label="Newsletter · Activos"
          value={data.suscriptores_activos}
          hint="Suscriptores"
        />
        <StatCard
          code="06"
          label="Top mes"
          value={data.top5_mes.length}
          unit="items"
          hint="Productos vendidos"
        />
      </section>

      {/* Top productos + stock bajo */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-neutral-900 bg-neutral-950 p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
              TOP 5 · MES EN CURSO
            </h2>
            <span className="font-mono text-[10px] text-neutral-700">[07]</span>
          </div>
          <ol className="mt-6 divide-y divide-neutral-900">
            {data.top5_mes.length === 0 ? (
              <li className="py-8 text-center font-mono text-[10px] tracking-[0.2em] text-neutral-600">
                [SIN VENTAS ESTE MES]
              </li>
            ) : (
              data.top5_mes.map((p, i) => (
                <li
                  key={p.producto}
                  className="flex items-baseline gap-4 py-3"
                >
                  <span className="font-mono text-[10px] text-neutral-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate text-sm text-white">
                    {p.producto}
                  </span>
                  <span className="font-mono text-sm text-neutral-300">
                    {p.cantidad}
                  </span>
                </li>
              ))
            )}
          </ol>
        </div>

        <div className="border border-neutral-900 bg-neutral-950 p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
              STOCK CRÍTICO
            </h2>
            <span className="font-mono text-[10px] text-neutral-700">[08]</span>
          </div>
          <ol className="mt-6 divide-y divide-neutral-900">
            {stock.items.length === 0 ? (
              <li className="py-8 text-center font-mono text-[10px] tracking-[0.2em] text-[#00C853]">
                [INVENTARIO OK]
              </li>
            ) : (
              stock.items.slice(0, 5).map((s) => (
                <li key={s.stock_id} className="py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex-1 truncate text-sm text-white">
                      {s.producto}
                    </span>
                    <span className="font-mono text-sm text-[#D71921]">
                      {s.cantidad}/{s.stock_minimo}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-neutral-600">
                    {s.variante.toUpperCase()} · {s.sku_variante}
                  </p>
                </li>
              ))
            )}
          </ol>
        </div>
      </section>
    </div>
  );
}
