import type { NotePart } from "@/core/types";
import { ref, snapshot, type Highlight } from "@/models/array/snapshot";
import type { ArrayEvent, ArrayStep } from "@/models/array/types";

/*
 * Selection Sort exactly as in the pseudocode on the page: the minimum is searched from
 * the left and always swapped, even with itself (the reference variant of
 * docs/research/04-evaluacni-datasety.md, without the `if min ≠ i` test).
 *
 *  1  procedure selectionSort(A)
 *  2    n ← length(A)
 *  3    for i ← 0 to n-2 do
 *  4      min ← i
 *  5      for j ← i+1 to n-1 do
 *  6        if A[j] < A[min] then
 *  7          min ← j
 *  8      swap(A[i], A[min])
 */
export function selectionSortTrace(input: number[]): ArrayStep[] {
  const a = [...input];
  const steps: ArrayStep[] = [];
  const sorted: number[] = [];
  let cmp = 0;
  let swp = 0;

  // Saves a snapshot of the current moment.
  const record = (line: number, event: ArrayEvent, note: NotePart[], highlight: Highlight = {}) => {
    steps.push({ state: snapshot(a, { ...highlight, sorted }), event, note, line, counters: { cmp, swp } });
  };

  record(2, { type: "start" }, ["ready"]);

  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    record(4, { type: "phase", name: "pass" }, [`pass ${i + 1}: minimum is`, ref(min, "pivot")], { pivot: min });

    for (let j = i + 1; j < a.length; j++) {
      cmp++;
      record(6, { type: "compare", i: j, j: min }, ["comparing", ref(j, "compared"), "with minimum", ref(min, "pivot")], {
        compared: [j],
        pivot: min,
      });
      if (a[j] < a[min]) {
        min = j;
        record(7, { type: "phase", name: "minimum" }, ["new minimum", ref(min, "pivot")], { pivot: min });
      }
    }

    [a[i], a[min]] = [a[min], a[i]];
    swp++;
    record(
      8,
      { type: "swap", i, j: min },
      min === i ? ["minimum", ref(i, "active"), "is already in place"] : ["swapped", ref(i, "active"), ref(min, "active")],
      { active: [i, min] },
    );

    // The minimum of the rest stays at position i for good.
    sorted.push(i);
    record(8, { type: "settle", at: i }, [ref(i, "sorted"), "in place"]);
  }

  // The last value has nowhere else to go.
  sorted.push(a.length - 1);
  record(3, { type: "done" }, ["sorted"]);
  return steps;
}
