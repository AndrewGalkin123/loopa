/** State class of one bar: "", "active", "compared", "sorted", "pivot" or "dimmed". */
export type BarClass = "" | "active" | "compared" | "sorted" | "pivot" | "dimmed";

interface VizBarsProps {
  values: number[];
  /** Decides the colour state of the bar at index i. */
  classOf?: (index: number, value: number) => BarClass;
  /** Show the value under each bar (algorithm page). */
  labels?: boolean;
  /** Smallest bar height in percent, so tiny values stay visible. */
  minHeight?: number;
}

/**
 * Row of bars whose heights are proportional to the values.
 * Colours and sizes come from the page CSS (.viz-bars .bar.*).
 */
export function VizBars({ values, classOf, labels = false, minHeight = 6 }: VizBarsProps) {
  const max = Math.max(...values);
  return (
    <div className="viz-bars" aria-hidden="true">
      {values.map((value, i) => {
        const state = classOf?.(i, value) ?? "";
        return (
          <div
            key={i}
            className={state ? `bar ${state}` : "bar"}
            style={{ height: `${Math.max(minHeight, Math.round((value / max) * 100))}%` }}
          >
            {labels && <span className="lab">{value}</span>}
          </div>
        );
      })}
    </div>
  );
}
