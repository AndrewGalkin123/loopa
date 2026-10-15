import type { AlgorithmTracer, ArrayStep } from "../types";

/*
 * Quick Sort with the Lomuto partition, pivot = last element of the part
 * (Cormen et al., the same convention as the research tests in
 * docs/research/tools/answer_keys.py). The comments show which pseudocode
 * line each step belongs to.
 *
 *  1  procedure quickSort(A, lo, hi)
 *  2    if lo < hi then
 *  3      p ← partition(A, lo, hi)
 *  4      quickSort(A, lo, p-1)
 *  5      quickSort(A, p+1, hi)
 *  6
 *  7  procedure partition(A, lo, hi)
 *  8    pivot ← A[hi]
 *  9    i ← lo - 1
 * 10    for j ← lo to hi-1 do
 * 11      if A[j] ≤ pivot then
 * 12        i ← i + 1
 * 13        swap(A[i], A[j])
 * 14    swap(A[i+1], A[hi])
 * 15    return i + 1
 */
function trace(input: number[]): ArrayStep[] {
  const a = [...input];
  const steps: ArrayStep[] = [];
  const sorted: number[] = [];
  let cmp = 0;
  let swp = 0;

  // Saves a snapshot of the current moment.
  const record = (
    kind: ArrayStep["kind"],
    line: number,
    extra: { indices?: number[]; pivot?: number; range?: [number, number] } = {},
  ) => {
    steps.push({
      kind,
      line,
      indices: extra.indices ?? [],
      pivot: extra.pivot,
      range: extra.range,
      array: [...a],
      sorted: [...sorted],
      pass: 0,
      cmp,
      swp,
    });
  };

  function partition(lo: number, hi: number): number {
    const range: [number, number] = [lo, hi];
    const pivot = a[hi];
    record("partition", 8, { pivot: hi, range });

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      cmp++;
      record("compare", 11, { indices: [j], pivot: hi, range });
      if (a[j] <= pivot) {
        i++;
        // Swapping an element with itself changes nothing, so it is neither shown nor counted.
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swp++;
          record("swap", 13, { indices: [i, j], pivot: hi, range });
        }
      }
    }

    // The pivot jumps right behind the "≤ pivot" part — its final place.
    const p = i + 1;
    if (p !== hi) {
      [a[p], a[hi]] = [a[hi], a[p]];
      swp++;
    }
    sorted.push(p);
    record("settle", 14, { indices: [p], range });
    return p;
  }

  function quickSort(lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(lo, hi);
      quickSort(lo, p - 1);
      quickSort(p + 1, hi);
    } else if (lo === hi) {
      // A part of one element is sorted by itself (the condition on line 2 is false).
      sorted.push(lo);
      record("settle", 2, { indices: [lo], range: [lo, hi] });
    }
    // An empty part (lo > hi) needs nothing and is not shown.
  }

  record("start", 1);
  quickSort(0, a.length - 1);
  record("done", 0);
  return steps;
}

export const quickSortTracer: AlgorithmTracer = {
  trace,
  // Lines 3–5 are the recursion, 9 and 12 only move the index i, 15 returns.
  lineAliases: { 3: 8, 4: 8, 5: 8, 7: 8, 9: 11, 10: 11, 12: 13, 15: 14 },
};
