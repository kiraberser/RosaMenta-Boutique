export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-28 w-24 animate-pulse rounded-lg bg-neutral-200" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
                <div className="h-8 w-32 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    </main>
  );
}
