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
  /** Makes the bars buttons (the mode Předpověz waits for a click on one). */
  onBarClick?: (index: number) => void;
  /** Extra class of a bar, e.g. how an answer of the mode Předpověz is marked. */
  extraClassOf?: (index: number) => string;
}

/**
 * Row of bars whose heights are proportional to the values.
 * Colours and sizes come from the page CSS (.viz-bars .bar.*).
 */
export function VizBars({ values, classOf, labels = false, minHeight = 6, onBarClick, extraClassOf }: VizBarsProps) {
  const max = Math.max(...values);
  return (
    <div className="viz-bars" aria-hidden={onBarClick ? undefined : "true"}>
      {values.map((value, i) => {
        const className = ["bar", classOf?.(i, value), extraClassOf?.(i)].filter(Boolean).join(" ");
        const style = { height: `${Math.max(minHeight, Math.round((value / max) * 100))}%` };
        const label = labels && <span className="lab">{value}</span>;
        return onBarClick ? (
          <button key={i} type="button" className={className} style={style} aria-label={`[${i}] = ${value}`} onClick={() => onBarClick(i)}>
            {label}
          </button>
        ) : (
          <div key={i} className={className} style={style}>
            {label}
          </div>
        );
      })}
    </div>
  );
}
