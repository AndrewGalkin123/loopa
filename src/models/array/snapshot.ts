import type { NotePart } from "@/core/types";
import type { ArrayMark, ArrayState } from "./types";

/* Helpers for algorithms on arrays: building snapshots and status lines. */

/** What an algorithm wants highlighted in one step. */
export interface Highlight {
  /** Indices already in their final place (cyan). */
  sorted?: number[];
  /** Indices being compared (amber). */
  compared?: number[];
  /** Indices being swapped or written (lime). */
  active?: number[];
  /** Index of the pivot (pink). */
  pivot?: number;
  /** The part being worked on, [from, to]; everything outside is dimmed. */
  range?: [number, number];
}

/**
 * Snapshot of the array with marks. One bar has one mark; when several apply,
 * the first one in this order wins: sorted, compared / active, pivot, dimmed.
 */
export function snapshot(values: number[], highlight: Highlight = {}): ArrayState {
  const marks: Partial<Record<number, ArrayMark>> = {};
  const { sorted = [], compared = [], active = [], pivot, range } = highlight;

  values.forEach((_, i) => {
    if (sorted.includes(i)) marks[i] = "sorted";
    else if (compared.includes(i)) marks[i] = "compared";
    else if (active.includes(i)) marks[i] = "active";
    else if (i === pivot) marks[i] = "pivot";
    else if (range && (i < range[0] || i > range[1])) marks[i] = "dimmed";
  });

  return { values: [...values], marks };
}

/** "[3]" in the colour of a mark — an index in the status line. */
export function ref(index: number, mark: ArrayMark): NotePart {
  return { text: `[${index}]`, mark };
}

/** "[2..7]" — a part of the array in the status line. */
export function span(from: number, to: number): string {
  return `[${from}..${to}]`;
}
