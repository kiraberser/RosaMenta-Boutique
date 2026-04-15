type Row = {
  label: string;
  value: number;
  hint?: string;
  tone?: "neutral" | "accent";
};

export function BarList({ rows, unit }: { rows: Row[]; unit?: string }) {
  if (rows.length === 0) {
    return (
      <p className="border border-neutral-900 bg-neutral-950 px-6 py-12 text-center font-mono text-[10px] tracking-[0.25em] text-neutral-600">
        [SIN DATOS]
      </p>
    );
  }

  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="space-y-4">
      {rows.map((r) => {
        const pct = Math.round((r.value / max) * 100);
        const barColor =
          r.tone === "accent" ? "bg-[#D71921]" : "bg-white";
        return (
          <li key={r.label} className="space-y-2">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="tracking-[0.2em] text-neutral-400">
                {r.label.toUpperCase()}
              </span>
              <span className="text-neutral-300">
                {unit ? `${r.value.toLocaleString("es-MX")} ${unit}` : r.value.toLocaleString("es-MX")}
                {r.hint ? (
                  <span className="ml-2 text-neutral-600">· {r.hint}</span>
                ) : null}
              </span>
            </div>
            <div className="relative h-1 w-full bg-neutral-900">
              <div
                className={`absolute inset-y-0 left-0 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
