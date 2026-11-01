import type { NotePart } from "@/core/types";
import { ref, snapshot, targetNote, type SearchHighlight } from "@/models/search/snapshot";
import type { SearchEvent, SearchInput, SearchStep } from "@/models/search/types";

/*
 * Binary search on a sorted array, closed interval lo ≤ hi (the variant named in
 * docs/research/04-evaluacni-datasety.md). Each recorded step says which pseudocode
 * line it belongs to.
 *
 *  1  procedure binarySearch(A, x)
 *  2    lo ← 0;  hi ← n - 1
 *  3    while lo ≤ hi do
 *  4      mid ← ⌊(lo + hi) / 2⌋
 *  5      if A[mid] = x then
 *  6        return mid
 *  7      else if A[mid] < x then
 *  8        lo ← mid + 1
 *  9      else
 * 10        hi ← mid - 1
 * 11    return -1
 */
export function binarySearchTrace({ values, target }: SearchInput): SearchStep[] {
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

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = values[mid];
    const midPointer = [{ label: "mid", index: mid }];
    probes++;
    record(5, { type: "probe", index: mid }, ["mid", ref(mid, "compared"), `= ${value}`], { probe: mid }, midPointer);

    if (value === target) {
      record(6, { type: "done", found: mid }, ["found at", ref(mid, "sorted")], { found: mid }, midPointer);
      return steps;
    }
    if (value < target) {
      lo = mid + 1;
      record(8, { type: "narrow", lo, hi }, [`${value} <`, targetNote(target), `→ lo = ${lo}`]);
    } else {
      hi = mid - 1;
      record(10, { type: "narrow", lo, hi }, [`${value} >`, targetNote(target), `→ hi = ${hi}`]);
    }
  }

  record(11, { type: "done", found: null }, ["lo > hi:", targetNote(target), "is not in the array"]);
  return steps;
}
