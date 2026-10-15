import type { AlgorithmTracer, ArrayStep } from "../types";

/*
 * Bubble Sort exactly as in the pseudocode on the page (version with the
 * `swapped` flag and the shrinking bound n). The comments show which
 * pseudocode line each step belongs to.
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
function trace(input: number[]): ArrayStep[] {
  const a = [...input];
  const steps: ArrayStep[] = [];
  let sorted: number[] = [];
  let cmp = 0;
  let swp = 0;
  let pass = 0;

  // Saves a snapshot of the current moment.
  const record = (kind: ArrayStep["kind"], line: number, indices: number[] = []) => {
    steps.push({ kind, line, indices, array: [...a], sorted: [...sorted], pass, cmp, swp });
  };

  let n = a.length;
  record("start", 2);

  let swapped: boolean;
  do {
    pass++;
    swapped = false;
    record("pass", 4);

    for (let i = 1; i < n; i++) {
      cmp++;
      record("compare", 6, [i - 1, i]);
      if (a[i - 1] > a[i]) {
        [a[i - 1], a[i]] = [a[i], a[i - 1]];
        swp++;
        swapped = true;
        record("swap", 7, [i - 1, i]);
      }
    }

    // The largest remaining value has bubbled up to position n-1 and stays there.
    n--;
    sorted = [n, ...sorted];
    record("settle", 9, [n]);
  } while (swapped);

  // A pass without a single swap means the whole array is sorted.
  sorted = a.map((_, i) => i);
  record("done", 10);
  return steps;
}

export const bubbleSortTracer: AlgorithmTracer = {
  trace,
  // Lines 1, 3, 5 and 8 have no step of their own.
  lineAliases: { 1: 2, 3: 4, 5: 6, 8: 7 },
};
