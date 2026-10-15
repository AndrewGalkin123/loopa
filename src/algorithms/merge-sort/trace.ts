import type { AlgorithmTracer, ArrayStep } from "../types";

/*
 * Top-down Merge Sort (Cormen et al.). The comments show which pseudocode
 * line each step belongs to.
 *
 *  1  procedure mergeSort(A, lo, hi)
 *  2    if lo < hi then
 *  3      mid ← ⌊(lo + hi) / 2⌋
 *  4      mergeSort(A, lo, mid)
 *  5      mergeSort(A, mid+1, hi)
 *  6      merge(A, lo, mid, hi)
 *  7
 *  8  procedure merge(A, lo, mid, hi)
 *  9    L ← A[lo..mid];  R ← A[mid+1..hi]
 * 10    i ← 0;  j ← 0;  k ← lo
 * 11    while i < |L| and j < |R| do
 * 12      if L[i] ≤ R[j] then
 * 13        A[k] ← L[i];  i ← i + 1
 * 14      else
 * 15        A[k] ← R[j];  j ← j + 1
 * 16      k ← k + 1
 * 17    A[k..hi] ← L[i..] + R[j..]
 *
 * How the bars show a merge: the real algorithm copies both halves into the
 * helper arrays L and R and overwrites A[lo..hi]. Drawn literally, the bars
 * would contain duplicates for a while. The bars therefore show the logical
 * state instead: the merged part, then what is left of L, then what is left
 * of R. Comparisons and the order of writes are exactly those of the real merge.
 */
function trace(input: number[]): ArrayStep[] {
  const a = [...input];
  const n = a.length;
  const steps: ArrayStep[] = [];
  let sorted: number[] = [];
  let cmp = 0;
  let writes = 0;

  // Saves a snapshot of the current moment.
  const record = (
    kind: ArrayStep["kind"],
    line: number,
    extra: { indices?: number[]; range?: [number, number]; mid?: number } = {},
  ) => {
    steps.push({
      kind,
      line,
      indices: extra.indices ?? [],
      range: extra.range,
      mid: extra.mid,
      array: [...a],
      sorted: [...sorted],
      pass: 0,
      cmp,
      swp: writes,
    });
  };

  function merge(lo: number, mid: number, hi: number) {
    const range: [number, number] = [lo, hi];
    record("merge", 9, { range, mid });
    // Only the very last merge puts elements into their final places.
    const isLast = lo === 0 && hi === n - 1;

    let leftRemaining = mid - lo + 1;
    let rightRemaining = hi - mid;
    let k = lo;
    while (leftRemaining > 0 && rightRemaining > 0) {
      // In the bars, L[i] stands at k and R[j] right after the rest of L.
      const l = k;
      const r = k + leftRemaining;
      cmp++;
      record("compare", 12, { indices: [l, r], range, mid });

      let line: number;
      if (a[l] <= a[r]) {
        // L[i] is already at k — nothing moves.
        leftRemaining--;
        line = 13;
      } else {
        // R[j] moves to k; the rest of L shifts one place to the right.
        const [value] = a.splice(r, 1);
        a.splice(k, 0, value);
        rightRemaining--;
        line = 15;
      }
      writes++;
      if (isLast) sorted = [...sorted, k];
      record("write", line, { indices: [k], range, mid });
      k++;
    }

    // One half ran out; the rest of the other one is already in place behind the merged part.
    if (k <= hi) {
      const rest = Array.from({ length: hi - k + 1 }, (_, t) => k + t);
      writes += rest.length;
      if (isLast) sorted = [...sorted, ...rest];
      record("write", 17, { indices: rest, range, mid });
    }
  }

  function mergeSort(lo: number, hi: number) {
    if (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      record("split", 3, { range: [lo, hi], mid });
      mergeSort(lo, mid);
      mergeSort(mid + 1, hi);
      merge(lo, mid, hi);
    }
    // A part of one element is sorted by itself.
  }

  record("start", 1);
  mergeSort(0, n - 1);
  sorted = a.map((_, i) => i);
  record("done", 0);
  return steps;
}

export const mergeSortTracer: AlgorithmTracer = {
  trace,
  // 2, 4, 5: recursion → split; 6, 8: merge; 10, 11, 16: loop bookkeeping → compare; 14 → else branch.
  lineAliases: { 2: 3, 4: 3, 5: 3, 6: 9, 8: 9, 10: 12, 11: 12, 14: 15, 16: 12 },
  swapLabel: "wrt",
};
