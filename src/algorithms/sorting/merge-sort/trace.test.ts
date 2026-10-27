import { describe, expect, test } from "vitest";
import { ascending, randomArrays } from "@/algorithms/testUtils";
import { mergeSortTrace } from "./trace";

/** Textbook top-down merge sort with helper arrays, counting comparisons and writes. */
function reference(input: number[]) {
  const a = [...input];
  let comparisons = 0;
  let writes = 0;
  const merge = (lo: number, mid: number, hi: number) => {
    const L = a.slice(lo, mid + 1);
    const R = a.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;
    while (i < L.length && j < R.length) {
      comparisons++;
      a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
      writes++;
    }
    while (i < L.length) {
      a[k++] = L[i++];
      writes++;
    }
    while (j < R.length) {
      a[k++] = R[j++];
      writes++;
    }
  };
  const sort = (lo: number, hi: number) => {
    if (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      sort(lo, mid);
      sort(mid + 1, hi);
      merge(lo, mid, hi);
    }
  };
  sort(0, a.length - 1);
  return { result: a, comparisons, writes };
}

describe("Merge Sort", () => {
  test("same result, comparisons and writes as the textbook algorithm", () => {
    for (const input of randomArrays(300)) {
      const expected = reference(input);
      const last = mergeSortTrace(input).at(-1)!;
      expect(last.state.values).toEqual(expected.result);
      expect(last.counters).toEqual({ cmp: expected.comparisons, wrt: expected.writes });
    }
  });

  test("when a merge ends, its part of the array is sorted", () => {
    for (const input of randomArrays(100, 3)) {
      const steps = mergeSortTrace(input);
      let range: [number, number] | undefined;
      steps.forEach((step, i) => {
        if (step.event.type === "phase" && step.event.name === "merge") range = step.event.range;
        // The last write of a merge: the next step is neither a comparison nor a write of the same merge.
        const next = steps[i + 1]?.event.type;
        if (step.event.type === "write" && next !== "compare" && next !== "write" && range) {
          const part = step.state.values.slice(range[0], range[1] + 1);
          expect(part).toEqual([...part].sort((a, b) => a - b));
        }
      });
    }
  });

  test("already sorted input needs about half the comparisons (one half always runs out first)", () => {
    const sortedCmp = mergeSortTrace(ascending(16)).at(-1)!.counters.cmp;
    expect(sortedCmp).toBe(32); // n/2 · log2 n
  });
});
