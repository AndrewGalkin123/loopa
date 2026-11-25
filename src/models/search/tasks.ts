import type { Task } from "@/core/types";
import type { SearchEvent, SearchInput, SearchState, SearchStep } from "./types";

/** A task of a search algorithm. */
export type SearchTask = Task<SearchInput, SearchState, SearchEvent>;

/** How many elements the search looked at, and whether it found the target. */
export function outcome(steps: SearchStep[]) {
  const last = steps[steps.length - 1];
  return { probes: last.counters.probes, found: last.event.type === "done" && last.event.found !== null };
}

/** The most probes binary search needs on n elements: ⌊log₂ n⌋ + 1. */
export const binaryWorst = (n: number) => Math.floor(Math.log2(n)) + 1;
