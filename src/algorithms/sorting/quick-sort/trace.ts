import type { NotePart } from "@/core/types";
import { ref, snapshot, span, type Highlight } from "@/models/array/snapshot";
import type { ArrayEvent, ArrayStep } from "@/models/array/types";

/*
 * Quick Sort with the Lomuto partition, pivot = last element of the part
 * (Cormen et al., the same convention as the research tests in
 * docs/research/tools/answer_keys.py). Each recorded step says which
 * pseudocode line it belongs to.
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
export function quickSortTrace(input: number[]): ArrayStep[] {
  const a = [...input];
  const steps: ArrayStep[] = [];
  const sorted: number[] = [];
  let cmp = 0;
  let swp = 0;

  // Saves a snapshot of the current moment.
  const record = (line: number, event: ArrayEvent, note: NotePart[], highlight: Highlight = {}) => {
    steps.push({ state: snapshot(a, { ...highlight, sorted }), event, note, line, counters: { cmp, swp } });
  };

  function partition(lo: number, hi: number): number {
    const range: [number, number] = [lo, hi];
    const pivot = a[hi];
    record(8, { type: "phase", name: "partition", range }, ["partition", `${span(lo, hi)},`, "pivot", ref(hi, "pivot")], {
      pivot: hi,
      range,
    });

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      cmp++;
      record(11, { type: "compare", i: j, j: hi }, ["comparing", ref(j, "compared"), "with pivot", ref(hi, "pivot")], {
        compared: [j],
        pivot: hi,
        range,
      });
      if (a[j] <= pivot) {
        i++;
        // Swapping an element with itself changes nothing, so it is neither shown nor counted.
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swp++;
          record(13, { type: "swap", i, j }, ["swapped", ref(i, "active"), ref(j, "active")], {
            active: [i, j],
            pivot: hi,
            range,
          });
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
    record(14, { type: "settle", at: p }, [ref(p, "sorted"), "in place"], { range });
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
      record(2, { type: "settle", at: lo }, [ref(lo, "sorted"), "in place"], { range: [lo, hi] });
    }
    // An empty part (lo > hi) needs nothing and is not shown.
  }

  record(1, { type: "start" }, ["ready"]);
  quickSort(0, a.length - 1);
  record(0, { type: "done" }, ["sorted"]);
  return steps;
}
