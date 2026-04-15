export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="h-8 w-56 animate-pulse rounded bg-neutral-200" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    </main>
  );
}
