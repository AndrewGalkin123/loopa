import type { NotePart } from "@/core/types";
import { ref, snapshot, targetNote, type SearchHighlight } from "@/models/search/snapshot";
import type { SearchEvent, SearchInput, SearchStep } from "@/models/search/types";

/*
 * Linear search: looks at the elements one by one, the array may be in any
 * order. Each recorded step says which pseudocode line it belongs to.
 *
 * 1  procedure linearSearch(A, x)
 * 2    for i ← 0 to n - 1 do
 * 3      if A[i] = x then
 * 4        return i
 * 5    return -1
 */
export function linearSearchTrace({ values, target }: SearchInput): SearchStep[] {
  const n = values.length;
  const steps: SearchStep[] = [];
  let probes = 0;

  const record = (line: number, event: SearchEvent, note: NotePart[], left: number, highlight: SearchHighlight = {}) => {
    steps.push({ state: snapshot(values, target, highlight), event, note, line, counters: { probes, left } });
  };

  record(1, { type: "start" }, ["looking for", targetNote(target)], n);

  for (let i = 0; i < n; i++) {
    probes++;
    const pointers = [{ label: "i", index: i }];
    record(3, { type: "probe", index: i }, ["A", ref(i, "compared"), `= ${values[i]}`], n - i, {
      probe: i,
      range: [i, n - 1],
      pointers,
    });
    if (values[i] === target) {
      record(4, { type: "done", found: i }, ["found at", ref(i, "sorted")], 1, { found: i, range: [i, i], pointers });
      return steps;
    }
  }

  // Everything was looked at: all the bars are ruled out.
  record(5, { type: "done", found: null }, [targetNote(target), "is not in the array"], 0, { range: [n, n - 1] });
  return steps;
}
