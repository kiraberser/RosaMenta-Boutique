import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id: number | string }>({
  columns,
  rows,
  empty = "Sin resultados",
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="border border-neutral-900 bg-neutral-950 px-6 py-16 text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-neutral-500">
          [{empty.toUpperCase()}]
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-900">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-neutral-950">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`border-b border-neutral-900 px-4 py-3 text-left font-mono text-[10px] tracking-[0.25em] text-neutral-500 ${
                  c.className ?? ""
                }`}
              >
                {c.header.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-neutral-900 last:border-b-0 hover:bg-neutral-950"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-4 py-4 text-neutral-200 ${c.className ?? ""}`}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
