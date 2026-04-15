import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <h2 className="text-2xl text-rosa-500">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm text-neutral-600">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
