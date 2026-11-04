import { ALGORITHMS } from "@/algorithms/registry";
import type { Step } from "@/core/types";
import type { ArrayStep } from "@/models/array/types";

/*
 * The compare mode: two algorithms on the same input share one clock, which counts
 * operations (comparisons, swaps, writes). Steps cannot be the clock: they are not
 * equal work — starting a new pass of Bubble Sort is a step that costs nothing.
 */

/** Algorithms that can be compared (for now the sorting ones). */
export const COMPARABLE = ALGORITHMS.filter((definition) => definition.model === "array").filter(
  (definition) => definition.group === "sorting",
);

export type Comparable = (typeof COMPARABLE)[number];

/** What both sides show at one moment of the shared clock. */
export interface CompareFrame {
  a: ArrayStep;
  b: ArrayStep;
  /** Operations each side has done so far. */
  opsA: number;
  opsB: number;
}

/** Operations done up to this step: the sum of its counters. */
export function operations(step: ArrayStep): number {
  return Object.values(step.counters).reduce((sum, value) => sum + value, 0);
}

/**
 * Returns what one side shows for growing values of the clock: the step that made the
 * latest finished operation, and once all its operations are done, its last step.
 * Steps that cost nothing are skipped: they would only delay the highlight of the operation.
 */
function follow(steps: ArrayStep[]) {
  const total = operations(steps[steps.length - 1]);
  let shown = 0;
  return (clock: number): ArrayStep => {
    if (clock >= total) return steps[steps.length - 1];
    for (let i = shown + 1; i < steps.length && operations(steps[i]) <= clock; i++) {
      if (operations(steps[i]) > operations(steps[shown])) shown = i;
    }
    return steps[shown];
  };
}

/** One frame per value of the clock, from 0 to the end of the slower algorithm. */
export function buildTimeline(stepsA: ArrayStep[], stepsB: ArrayStep[]): Step<CompareFrame>[] {
  const end = Math.max(operations(stepsA[stepsA.length - 1]), operations(stepsB[stepsB.length - 1]));
  const sideA = follow(stepsA);
  const sideB = follow(stepsB);
  return Array.from({ length: end + 1 }, (_, clock) => {
    const a = sideA(clock);
    const b = sideB(clock);
    return {
      state: { a, b, opsA: operations(a), opsB: operations(b) },
      event: { type: "tick" },
      note: [],
      line: 0,
      counters: {},
    };
  });
}

/** The two algorithms from the address, e.g. ?a=bubble-sort&b=quick-sort; wrong or equal ones are replaced. */
export function resolveSlots(a: unknown, b: unknown): [Comparable, Comparable] {
  const find = (slug: unknown) => COMPARABLE.find((definition) => definition.slug === slug);
  const first = find(a) ?? find("bubble-sort")!;
  const wanted = find(b);
  const fallback = first.slug === "quick-sort" ? find("bubble-sort")! : find("quick-sort")!;
  return [first, wanted && wanted !== first ? wanted : fallback];
}

/** Link to the compare page of two algorithms. */
export function compareHref(a: string, b: string): string {
  return `/compare?a=${a}&b=${b}`;
}
