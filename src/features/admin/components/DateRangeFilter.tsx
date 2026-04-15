"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const desde = sp.get("desde") ?? "";
  const hasta = sp.get("hasta") ?? "";

  const update = (key: "desde" | "hasta", value: string) => {
    const q = new URLSearchParams(sp.toString());
    if (value) q.set(key, value);
    else q.delete(key);
    q.delete("page");
    start(() => router.replace(`${pathname}?${q.toString()}`));
  };

  const clear = () => {
    const q = new URLSearchParams(sp.toString());
    q.delete("desde");
    q.delete("hasta");
    q.delete("page");
    start(() => router.replace(`${pathname}?${q.toString()}`));
  };

  const hasAny = Boolean(desde || hasta);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-neutral-500">
        DESDE
        <input
          type="date"
          value={desde}
          onChange={(e) => update("desde", e.target.value)}
          className="border border-neutral-800 bg-black px-2 py-1 font-mono text-[11px] text-neutral-200"
        />
      </label>
      <label className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-neutral-500">
        HASTA
        <input
          type="date"
          value={hasta}
          onChange={(e) => update("hasta", e.target.value)}
          className="border border-neutral-800 bg-black px-2 py-1 font-mono text-[11px] text-neutral-200"
        />
      </label>
      {hasAny ? (
        <button
          type="button"
          onClick={clear}
          className="font-mono text-[10px] tracking-[0.25em] text-[#D71921] hover:underline"
        >
          × LIMPIAR
        </button>
      ) : null}
      {pending ? (
        <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-600">
          [...]
        </span>
      ) : null}
    </div>
  );
}
