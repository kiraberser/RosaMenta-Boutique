"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const q = String(data.get("search") ?? "").trim();
    const next = new URLSearchParams(params.toString());
    if (q) next.set("search", q);
    else next.delete("search");
    next.delete("page");
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        name="search"
        defaultValue={params.get("search") ?? ""}
        placeholder="Buscar prendas, marcas..."
        className="flex-1 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm outline-none focus:border-rosa-500"
      />
      <button
        type="submit"
        className="rounded-full bg-rosa-500 px-5 py-2.5 text-sm text-white transition hover:bg-rosa-600"
      >
        Buscar
      </button>
    </form>
  );
}
