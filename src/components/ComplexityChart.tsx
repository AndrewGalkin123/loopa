/*
 * The chart under the complexity table of an algorithm page. The curves are computed
 * from the formulas and share one scale, so their heights can be compared honestly.
 * Constants are left out: the chart shows how the work grows, not how long it takes.
 */

const WIDTH = 720;
const TOP = 20;
const BOTTOM = 220;
const SAMPLES = 72;

const log = (n: number) => (n > 1 ? Math.log2(n) : 0);

/** The usual growth functions, without constants. */
export const GROWTH = {
  logLogN: (n: number) => log(log(n)),
  logN: log,
  n: (n: number) => n,
  nLogN: (n: number) => n * log(n),
  n2: (n: number) => n * n,
};

export interface ChartCurve {
  label: string;
  /** How the work grows with the size of the input. */
  grows: (n: number) => number;
  /** The algorithm of the page is drawn solid; what it is compared with dashed or dotted. */
  style?: "solid" | "dash" | "dot";
}

const STROKES = {
  solid: { stroke: "#a3e635", strokeWidth: 2.5 },
  dash: { stroke: "#71717a", strokeWidth: 2, strokeDasharray: "5 5" },
  dot: { stroke: "#71717a", strokeWidth: 2, strokeDasharray: "1 6", strokeLinecap: "round" as const },
};

export function ComplexityChart({ title, axis, variable = "n", max = 100, curves }: {
  /** E.g. "velikost pole → čas". */
  title: string;
  /** What the horizontal axis is, e.g. "velikost vstupu n". */
  axis: string;
  variable?: string;
  /** The largest input size on the chart. */
  max?: number;
  curves: ChartCurve[];
}) {
  const sampled = curves.map((curve) =>
    Array.from({ length: SAMPLES + 1 }, (_, k) => {
      const n = (k / SAMPLES) * max;
      return { n, value: curve.grows(n) };
    }),
  );
  const highest = Math.max(...sampled.flat().map((point) => point.value));
  const x = (n: number) => ((n / max) * WIDTH).toFixed(1);
  const y = (value: number) => (BOTTOM - (value / highest) * (BOTTOM - TOP)).toFixed(1);

  // The algorithm of the page is drawn last, on top of the others.
  const drawn = curves.map((curve, i) => ({ curve, points: sampled[i] })).reverse();

  return (
    <>
      <div className="chart-head">
        <div className="t">{title}</div>
        <div className="chart-legend">
          {curves.map((curve) => (
            <span key={curve.label} className={curve.style && curve.style !== "solid" ? `lg ${curve.style}` : "lg"}>
              <span className="ln" /> {curve.label}
            </span>
          ))}
        </div>
      </div>
      <svg className="chart-svg" viewBox="0 0 720 240" preserveAspectRatio="none" aria-hidden="true">
        {/* grid */}
        <g stroke="#1f1f23" strokeWidth="1">
          <line x1="0" y1="60" x2="720" y2="60" />
          <line x1="0" y1="120" x2="720" y2="120" />
          <line x1="0" y1="180" x2="720" y2="180" />
        </g>
        {/* axes */}
        <g stroke="#2a2a2f" strokeWidth="1">
          <line x1="0" y1="220" x2="720" y2="220" />
          <line x1="1" y1="20" x2="1" y2="220" />
        </g>
        {drawn.map(({ curve, points }) => {
          const stroke = STROKES[curve.style ?? "solid"];
          const end = points[points.length - 1];
          return (
            <g key={curve.label}>
              <path d={points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.n)},${y(p.value)}`).join(" ")} fill="none" {...stroke} />
              <circle cx={x(end.n)} cy={y(end.value)} r={curve.style && curve.style !== "solid" ? 3 : 3.5} fill={stroke.stroke} />
            </g>
          );
        })}
      </svg>
      <div className="chart-axis">
        <span>{variable} = 0</span>
        <span>{axis}</span>
        <span>
          {variable} = {max}
        </span>
      </div>
    </>
  );
}
