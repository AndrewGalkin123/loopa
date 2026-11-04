import type { NotePart } from "@/core/types";
import { ref, snapshot, type Highlight } from "@/models/array/snapshot";
import type { ArrayEvent, ArrayStep } from "@/models/array/types";

/*
 * Insertion Sort exactly as in the pseudocode on the page, which is the one of the
 * research test (docs/research/02-testy-pre-post.md). Only a shift (line 6) counts
 * as a write, as in the test; placing the key does not.
 *
 * The bars show the logical state: the key stands in the gap it is moving through.
 * In the real array it waits in a variable and the gap holds an old copy of a value.
 *
 *  1  procedure insertionSort(A, n)
 *  2    for i ← 1 to n-1 do
 *  3      key ← A[i]
 *  4      j ← i-1
 *  5      while j ≥ 0 and A[j] > key do
 *  6        A[j+1] ← A[j]
 *  7        j ← j-1
 *  8      A[j+1] ← key
 */
export function insertionSortTrace(input: number[]): ArrayStep[] {
  const a = [...input];
  const steps: ArrayStep[] = [];
  let cmp = 0;
  let shf = 0;

  // Saves a snapshot of the current moment.
  const record = (line: number, event: ArrayEvent, note: NotePart[], highlight: Highlight = {}) => {
    steps.push({ state: snapshot(a, highlight), event, note, line, counters: { cmp, shf } });
  };

  record(1, { type: "start" }, ["ready"]);

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    // Everything to the right of i has not been looked at yet.
    const range: [number, number] = [0, i];
    record(3, { type: "phase", name: "insert", range }, ["key", ref(i, "pivot"), `= ${key}`], { pivot: i, range });

    let j = i - 1;
    while (j >= 0) {
      cmp++;
      record(5, { type: "compare", i: j, j: j + 1 }, ["comparing", ref(j, "compared"), "with key"], {
        compared: [j],
        pivot: j + 1,
        range,
      });
      if (a[j] <= key) break;

      a[j + 1] = a[j];
      a[j] = key;
      shf++;
      record(6, { type: "write", at: [j + 1] }, ["shifted", ref(j + 1, "active"), "to the right"], {
        active: [j + 1],
        pivot: j,
        range,
      });
      j--;
    }

    record(8, { type: "write", at: [j + 1] }, ["key placed at", ref(j + 1, "pivot")], { pivot: j + 1, range });
  }

  // The left part is sorted during the run, but its values are final only now.
  record(2, { type: "done" }, ["sorted"], { sorted: a.map((_, i) => i) });
  return steps;
}
