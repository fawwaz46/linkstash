// A tiny dependency-free SVG bar chart. Handles empty data gracefully.
export function BarChart({
  data,
  height = 160,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-muted">No data yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = 100 / data.length;

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 24);
          return (
            <rect
              key={i}
              x={i * barW + barW * 0.15}
              y={height - 20 - h}
              width={barW * 0.7}
              height={h}
              rx="1"
              fill="var(--color-accent)"
            />
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
        {data.map((d, i) => (
          <span key={i} className="flex-1 truncate text-center" title={`${d.label}: ${d.value}`}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
