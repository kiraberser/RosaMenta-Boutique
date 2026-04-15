export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 h-3 w-64 animate-pulse rounded bg-neutral-200" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse rounded-2xl bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-8 w-1/3 animate-pulse rounded bg-neutral-200" />
          <div className="h-24 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-12 w-full animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </main>
  );
}
