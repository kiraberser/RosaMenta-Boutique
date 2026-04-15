import type { ReactNode } from "react";

type Tone = "neutral" | "alert" | "success";

const toneColor: Record<Tone, string> = {
  neutral: "text-white",
  alert: "text-[#D71921]",
  success: "text-[#00C853]",
};

export function StatCard({
  label,
  value,
  unit,
  hint,
  tone = "neutral",
  code,
  children,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  tone?: Tone;
  code?: string;
  children?: ReactNode;
}) {
  return (
    <article className="flex flex-col justify-between border border-neutral-900 bg-neutral-950 p-6">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">
          {label.toUpperCase()}
        </p>
        {code ? (
          <span className="font-mono text-[10px] text-neutral-700">[{code}]</span>
        ) : null}
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span
          className={`font-mono text-4xl font-light tracking-tight sm:text-5xl ${toneColor[tone]}`}
        >
          {value}
        </span>
        {unit ? (
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-500">
            {unit}
          </span>
        ) : null}
      </div>

      {hint ? (
        <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-neutral-600">
          {hint.toUpperCase()}
        </p>
      ) : null}

      {children}
    </article>
  );
}
