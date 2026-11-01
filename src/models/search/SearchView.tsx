"use client";

import type { SearchState } from "./types";

/* Geometry of the 760 × 330 picture. */
const WIDTH = 760;
const BASE_Y = 268; // bottom of the bars
const AREA = 232; // height of the tallest bar
const MIN_BAR = 3; // so that a value of 0 stays visible
/** Up to this size the values are written under the bars; bigger arrays would overlap. */
const MAX_LABELED = 24;

/**
 * Player stage of the search model: bars, a horizontal line at the height of the
 * wanted value and the pointers (lo, mid, hi) under the bars. Interpolation search
 * also shows the straight line it uses to estimate the position.
 */
export function SearchView({ state }: { state: unknown }) {
  const { values, target, marks, pointers, estimate } = state as SearchState;
  const n = values.length;
  const gap = n > 24 ? 3 : 6;
  const barWidth = (WIDTH - gap * (n - 1)) / n;
  const scale = Math.max(1, target, ...values);

  const centre = (i: number) => i * (barWidth + gap) + barWidth / 2;
  const top = (value: number) => BASE_Y - (value / scale) * AREA;
  const targetY = top(target);

  // Pointers at the same position share one label, e.g. "lo mid".
  const labels = new Map<number, string[]>();
  for (const { label, index } of pointers) labels.set(index, [...(labels.get(index) ?? []), label]);

  // Where the line through A[lo] and A[hi] reaches the wanted value.
  const crossing =
    estimate && values[estimate.hi] !== values[estimate.lo]
      ? centre(estimate.lo) +
        ((target - values[estimate.lo]) / (values[estimate.hi] - values[estimate.lo])) *
          (centre(estimate.hi) - centre(estimate.lo))
      : null;

  return (
    <svg className="search-svg" viewBox={`0 0 ${WIDTH} 330`} aria-hidden="true">
      {values.map((value, i) => {
        const height = Math.max(MIN_BAR, (value / scale) * AREA);
        return (
          <g key={i} className={`search-bar ${marks[i] ?? ""}`}>
            <rect x={i * (barWidth + gap)} y={BASE_Y - height} width={barWidth} height={height} rx={2} />
            {n <= MAX_LABELED && (
              <text className="value" x={centre(i)} y={BASE_Y + 16}>
                {value}
              </text>
            )}
          </g>
        );
      })}

      <line className="target-line" x1={0} x2={WIDTH} y1={targetY} y2={targetY} />
      <text className="target-label" x={WIDTH} y={targetY - 6}>
        x = {target}
      </text>

      {estimate && (
        <>
          <line
            className="estimate-line"
            x1={centre(estimate.lo)}
            y1={top(values[estimate.lo])}
            x2={centre(estimate.hi)}
            y2={top(values[estimate.hi])}
          />
          {crossing !== null && (
            <>
              <line className="estimate-drop" x1={crossing} x2={crossing} y1={targetY} y2={BASE_Y} />
              <circle className="estimate-point" cx={crossing} cy={targetY} r={4} />
            </>
          )}
        </>
      )}

      {[...labels].map(([index, names]) => (
        <text key={index} className="pointer" x={centre(index)} y={BASE_Y + 36}>
          {names.join(" ")}
        </text>
      ))}
    </svg>
  );
}
