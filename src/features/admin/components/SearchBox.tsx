"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function SearchBox({ placeholder = "Buscar..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("search") ?? "");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const t = setTimeout(() => {
      const q = new URLSearchParams(params);
      if (value) q.set("search", value);
      else q.delete("search");
      q.delete("page");
      startTransition(() => {
        router.replace(`${pathname}?${q.toString()}`, { scroll: false });
      });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.3em] text-neutral-600">
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-neutral-800 bg-black px-8 py-2 font-mono text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none sm:w-72"
      />
    </div>
  );
}
