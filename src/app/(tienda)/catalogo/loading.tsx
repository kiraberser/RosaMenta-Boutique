export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white">
            <div className="aspect-[3/4] animate-pulse bg-neutral-200" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
