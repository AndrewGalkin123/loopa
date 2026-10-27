import type { NotePart } from "@/core/types";
import { ref, snapshot, type Highlight } from "@/models/array/snapshot";
import type { ArrayEvent, ArrayStep } from "@/models/array/types";

/*
 * Bubble Sort exactly as in the pseudocode on the page (version with the
 * `swapped` flag and the shrinking bound n). Each recorded step says which
 * pseudocode line it belongs to.
 *
 *  1  procedure bubbleSort(A : list)
 *  2    n ← length(A)
 *  3    repeat
 *  4      swapped ← false
 *  5      for i ← 1 to n-1 do
 *  6        if A[i-1] > A[i] then
 *  7          swap(A[i-1], A[i])
 *  8          swapped ← true
 *  9      n ← n-1
 * 10    until not swapped
 */
export function bubbleSortTrace(input: number[]): ArrayStep[] {
  const a = [...input];
  const steps: ArrayStep[] = [];
  let sorted: number[] = [];
  let cmp = 0;
  let swp = 0;

  // Saves a snapshot of the current moment.
  const record = (line: number, event: ArrayEvent, note: NotePart[], highlight: Highlight = {}) => {
    steps.push({ state: snapshot(a, { ...highlight, sorted }), event, note, line, counters: { cmp, swp } });
  };

  let n = a.length;
  record(2, { type: "start" }, ["ready"]);

  let pass = 0;
  let swapped: boolean;
  do {
    pass++;
    swapped = false;
    record(4, { type: "phase", name: "pass" }, [`pass ${pass}`]);

    for (let i = 1; i < n; i++) {
      cmp++;
      record(6, { type: "compare", i: i - 1, j: i }, ["comparing", ref(i - 1, "compared"), ref(i, "compared")], {
        compared: [i - 1, i],
      });
      if (a[i - 1] > a[i]) {
        [a[i - 1], a[i]] = [a[i], a[i - 1]];
        swp++;
        swapped = true;
        record(7, { type: "swap", i: i - 1, j: i }, ["swapped", ref(i - 1, "active"), ref(i, "active")], {
          active: [i - 1, i],
        });
      }
    }

    // The largest remaining value has bubbled up to position n-1 and stays there.
    n--;
    sorted = [n, ...sorted];
    record(9, { type: "settle", at: n }, [ref(n, "sorted"), "in place"]);
  } while (swapped);

  // A pass without a single swap means the whole array is sorted.
  sorted = a.map((_, i) => i);
  record(10, { type: "done" }, ["sorted"]);
  return steps;
}
