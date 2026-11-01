import type { NotePart } from "@/core/types";
import type { SearchMark, SearchState } from "./types";

/* Helpers for search algorithms: building snapshots and status lines. */

export interface SearchHighlight {
  /** The part that can still contain the target, [lo, hi]; everything outside is dimmed. */
  range?: [number, number];
  /** Index of the element being looked at. */
  probe?: number;
  /** Index where the target was found. */
  found?: number;
  pointers?: SearchState["pointers"];
  estimate?: SearchState["estimate"];
}

/** Snapshot with marks. Priority of one bar: found, probe, ruled out. */
export function snapshot(values: number[], target: number, highlight: SearchHighlight = {}): SearchState {
  const { range, probe, found, pointers = [], estimate } = highlight;
  const marks: Partial<Record<number, SearchMark>> = {};
  values.forEach((_, i) => {
    if (i === found) marks[i] = "sorted";
    else if (i === probe) marks[i] = "compared";
    else if (range && (i < range[0] || i > range[1])) marks[i] = "dimmed";
  });
  return { values, target, marks, pointers, ...(estimate ? { estimate } : {}) };
}

/** "[3]" in the colour of a mark — an index in the status line. */
export function ref(index: number, mark: SearchMark): NotePart {
  return { text: `[${index}]`, mark };
}

/** The wanted value in its colour, for the status line. */
export function targetNote(target: number): NotePart {
  return { text: String(target), mark: "target" };
}
