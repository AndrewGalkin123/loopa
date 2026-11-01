import type { NotePart } from "@/core/types";
import { ref, snapshot, targetNote, type SearchHighlight } from "@/models/search/snapshot";
import type { SearchEvent, SearchInput, SearchStep } from "@/models/search/types";

/*
 * Interpolation search on a sorted array: instead of the middle it looks where
 * the value should be if the values grew evenly between A[lo] and A[hi].
 * Each recorded step says which pseudocode line it belongs to.
 *
 *  1  procedure interpolationSearch(A, x)
 *  2    lo ← 0;  hi ← n - 1
 *  3    while lo ≤ hi and A[lo] ≤ x ≤ A[hi] do
 *  4      if A[lo] = A[hi] then
 *  5        pos ← lo
 *  6      else
 *  7        pos ← lo + ⌊(x - A[lo]) · (hi - lo) / (A[hi] - A[lo])⌋
 *  8      if A[pos] = x then
 *  9        return pos
 * 10      else if A[pos] < x then
 * 11        lo ← pos + 1
 * 12      else
 * 13        hi ← pos - 1
 * 14    return -1
 */
export function interpolationSearchTrace({ values, target }: SearchInput): SearchStep[] {
  const steps: SearchStep[] = [];
  let probes = 0;
  let lo = 0;
  let hi = values.length - 1;

  const record = (line: number, event: SearchEvent, note: NotePart[], highlight: SearchHighlight = {}, extra: { label: string; index: number }[] = []) => {
    const pointers = [
      { label: "lo", index: lo },
      ...extra,
      { label: "hi", index: hi },
    ].filter((p) => p.index >= 0 && p.index < values.length);
    steps.push({
      state: snapshot(values, target, { range: [lo, hi], pointers, ...highlight }),
      event,
      note,
      line,
      counters: { probes, left: Math.max(0, hi - lo + 1) },
    });
  };

  record(2, { type: "start" }, ["looking for", targetNote(target)]);

  while (lo <= hi && values[lo] <= target && target <= values[hi]) {
    let position: number;
    let estimate: SearchHighlight["estimate"];
    if (values[lo] === values[hi]) {
      position = lo;
    } else {
      position = lo + Math.floor(((target - values[lo]) * (hi - lo)) / (values[hi] - values[lo]));
      estimate = { lo, hi, position };
    }
    const value = values[position];
    const posPointer = [{ label: "pos", index: position }];
    record(estimate ? 7 : 5, { type: "estimate", position }, ["estimated pos =", String(position)], { estimate }, posPointer);

    probes++;
    record(8, { type: "probe", index: position }, ["pos", ref(position, "compared"), `= ${value}`], { probe: position, estimate }, posPointer);

    if (value === target) {
      record(9, { type: "done", found: position }, ["found at", ref(position, "sorted")], { found: position }, posPointer);
      return steps;
    }
    if (value < target) {
      lo = position + 1;
      record(11, { type: "narrow", lo, hi }, [`${value} <`, targetNote(target), `→ lo = ${lo}`]);
    } else {
      hi = position - 1;
      record(13, { type: "narrow", lo, hi }, [`${value} >`, targetNote(target), `→ hi = ${hi}`]);
    }
  }

  const note: NotePart[] =
    lo > hi ? ["lo > hi:", targetNote(target), "is not in the array"] : [targetNote(target), "is outside A[lo]..A[hi]: not in the array"];
  record(14, { type: "done", found: null }, note);
  return steps;
}
