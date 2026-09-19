import { useId, useMemo } from "react";

interface WpmChartProps {
  data: number[];
  height?: number;
}

export function WpmChart({ data, height = 160 }: WpmChartProps) {
  const areaGradientId = useId();
  const lineGradientId = useId();
  const width = 600;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = useMemo(
    () =>
      data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 24) - 12;
        return [x, y] as const;
      }),
    [data, height, min, range]
  );

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-40 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={`WPM history over ${data.length} tests, ranging from ${min} to ${max}`}
    >
      <defs>
        <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={lineGradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${areaGradientId})`} />
      <path d={linePath} fill="none" stroke={`url(#${lineGradientId})`} strokeWidth="2" />
      {points.map(([x, y], i) =>
        i === points.length - 1 ? (
          <circle key={i} cx={x} cy={y} r={4} fill="var(--accent)" />
        ) : null
      )}
    </svg>
  );
}
