type Point = { label: string; value: number };

export function Sparkline({
  data,
  height = 80,
  stroke = "#ffffff",
  fill = "#ffffff10",
}: {
  data: Point[];
  height?: number;
  stroke?: string;
  fill?: string;
}) {
  if (data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center font-mono text-[10px] tracking-[0.25em] text-neutral-700"
      >
        [SIN DATOS]
      </div>
    );
  }

  const w = 100;
  const h = 100;
  const max = Math.max(...data.map((d) => d.value), 1);
  const step = data.length > 1 ? w / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = i * step;
    const y = h - (d.value / max) * h;
    return { x, y, ...d };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div style={{ height }} className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden
      >
        <path d={area} fill={fill} stroke="none" />
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p) => (
          <circle
            key={`${p.x}-${p.y}`}
            cx={p.x}
            cy={p.y}
            r={1.2}
            fill={stroke}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
