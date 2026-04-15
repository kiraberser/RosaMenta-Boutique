import { getMovimientos, getStockBajo } from "@features/admin/api";
import { DataTable } from "@features/admin/components/DataTable";
import { PageHeader } from "@features/admin/components/PageHeader";
import { StatCard } from "@features/admin/components/StatCard";

export const dynamic = "force-dynamic";

export default async function InventarioPage() {
  const [stock, movs] = await Promise.all([
    getStockBajo().catch(() => ({ total: 0, items: [] })),
    getMovimientos().catch(() => ({ total: 0, items: [] })),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        code="02"
        title="Inventario"
        description="Stock crítico y últimos movimientos."
      />

      <section className="grid grid-cols-1 gap-px bg-neutral-900 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          code="01"
          label="SKU en riesgo"
          value={stock.total}
          tone={stock.total > 0 ? "alert" : "success"}
          hint={stock.total > 0 ? "Por debajo del mínimo" : "Inventario estable"}
        />
        <StatCard
          code="02"
          label="Movimientos · 500 últimos"
          value={movs.total}
          hint="Eventos registrados"
        />
        <StatCard
          code="03"
          label="Reposición sugerida"
          value={stock.items.reduce((a, s) => a + s.faltante, 0)}
          unit="u"
          hint="Suma de faltantes"
        />
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs tracking-[0.25em] text-neutral-400">
          STOCK BAJO · [10]
        </h2>
        <DataTable
          rows={stock.items.map((s) => ({ ...s, id: s.stock_id }))}
          empty="Inventario OK"
          columns={[
            {
              key: "producto",
              header: "Producto",
              render: (s) => (
                <div>
                  <p className="text-sm text-white">{s.producto}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-neutral-600">
                    {s.variante.toUpperCase()} · {s.sku_variante}
                  </p>
                </div>
              ),
            },
            {
              key: "cantidad",
              header: "Actual",
              render: (s) => (
                <span className="font-mono text-[#D71921]">{s.cantidad}</span>
              ),
            },
            {
              key: "minimo",
              header: "Mínimo",
              render: (s) => (
                <span className="font-mono text-neutral-400">
                  {s.stock_minimo}
                </span>
              ),
            },
            {
              key: "faltante",
              header: "Reponer",
              render: (s) => (
                <span className="font-mono text-white">{s.faltante}</span>
              ),
            },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs tracking-[0.25em] text-neutral-400">
          MOVIMIENTOS RECIENTES · [11]
        </h2>
        <DataTable
          rows={movs.items.slice(0, 20)}
          empty="Sin movimientos"
          columns={[
            {
              key: "fecha",
              header: "Fecha",
              render: (m) => (
                <span className="font-mono text-[11px] text-neutral-400">
                  {new Date(m.fecha).toLocaleString("es-MX")}
                </span>
              ),
            },
            {
              key: "tipo",
              header: "Tipo",
              render: (m) => (
                <span className="font-mono text-[10px] tracking-[0.2em] text-white">
                  {m.tipo_display.toUpperCase()}
                </span>
              ),
            },
            {
              key: "producto",
              header: "Producto",
              render: (m) => <span className="text-sm">{m.producto}</span>,
            },
            {
              key: "cantidad",
              header: "Δ",
              render: (m) => (
                <span
                  className={`font-mono ${
                    m.cantidad >= 0 ? "text-[#00C853]" : "text-[#D71921]"
                  }`}
                >
                  {m.cantidad >= 0 ? `+${m.cantidad}` : m.cantidad}
                </span>
              ),
            },
            {
              key: "usuario",
              header: "Usuario",
              render: (m) => (
                <span className="font-mono text-[11px] text-neutral-500">
                  {m.usuario ?? "—"}
                </span>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
