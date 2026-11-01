import type { AlgorithmDefinition, Step } from "@/core/types";

/* The "search" data model: an array drawn as bars and the value being looked for. */

/** Input of a search algorithm: the array and the wanted value. */
export interface SearchInput {
  values: number[];
  target: number;
}

/**
 * How a bar is coloured. Bars without a mark are grey.
 * compared — the element being looked at; sorted — found; dimmed — ruled out.
 */
export type SearchMark = "compared" | "sorted" | "dimmed";

/** Snapshot of the search after one step. */
export interface SearchState {
  values: number[];
  target: number;
  marks: Partial<Record<number, SearchMark>>;
  /** Named positions under the bars, e.g. lo, mid, hi. */
  pointers: { label: string; index: number }[];
  /** Interpolation: the straight line through A[lo] and A[hi] that estimates the position. */
  estimate?: { lo: number; hi: number; position: number };
}

/** What happened in one step, machine-readable. */
export type SearchEvent =
  | { type: "start" }
  /** The element at `index` is compared with the target. */
  | { type: "probe"; index: number }
  /** Interpolation only: `position` was estimated from A[lo] and A[hi]. */
  | { type: "estimate"; position: number }
  /** Only the part [lo, hi] can still contain the target. */
  | { type: "narrow"; lo: number; hi: number }
  /** The search ended: the index of the target, or null when it is not in the array. */
  | { type: "done"; found: number | null };

export type SearchStep = Step<SearchState, SearchEvent>;

/** An algorithm on the search model. `requiresSorted`: the array must be sorted ascending. */
export type SearchAlgorithm<Slug extends string = string> = AlgorithmDefinition<SearchInput, SearchState, SearchEvent> & {
  slug: Slug;
  model: "search";
  requiresSorted: boolean;
};

/** Declares a search algorithm (keeps the slug as a literal type, like defineArrayAlgorithm). */
export function defineSearchAlgorithm<const Slug extends string>(
  definition: Omit<SearchAlgorithm<Slug>, "model">,
): SearchAlgorithm<Slug> {
  return { ...definition, model: "search" };
}
