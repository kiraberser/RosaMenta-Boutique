import type { ReactNode } from "react";

export function PageHeader({
  code,
  title,
  description,
  action,
}: {
  code: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-neutral-900 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">
          [{code}] / {title.toUpperCase()}
        </p>
        <h1 className="mt-3 font-sans text-4xl font-light tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
