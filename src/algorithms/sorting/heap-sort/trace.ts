import type { NotePart } from "@/core/types";
import { ref, snapshot, type Highlight } from "@/models/array/snapshot";
import type { ArrayEvent, ArrayStep } from "@/models/array/types";

/*
 * Heap Sort as in the pseudocode on the page (Cormen: a max-heap built bottom-up,
 * then the maximum is moved to the end again and again). The recursion of siftDown
 * is written as a loop; it visits the same positions.
 * The heap is a tree stored in the array: the children of [i] are [2i+1] and [2i+2].
 *
 *  1  procedure heapSort(A)
 *  2    n ← length(A)
 *  3    for i ← ⌊n/2⌋-1 downto 0 do
 *  4      siftDown(A, i, n)
 *  5    for end ← n-1 downto 1 do
 *  6      swap(A[0], A[end])
 *  7      siftDown(A, 0, end)
 *  8
 *  9  procedure siftDown(A, i, size)
 * 10    largest ← i
 * 11    l ← 2i+1
 * 12    r ← 2i+2
 * 13    if l < size and A[l] > A[largest] then
 * 14      largest ← l
 * 15    if r < size and A[r] > A[largest] then
 * 16      largest ← r
 * 17    if largest ≠ i then
 * 18      swap(A[i], A[largest])
 * 19      siftDown(A, largest, size)
 */
export function heapSortTrace(input: number[]): ArrayStep[] {
  const a = [...input];
  const steps: ArrayStep[] = [];
  const sorted: number[] = [];
  let cmp = 0;
  let swp = 0;

  // Saves a snapshot of the current moment.
  const record = (line: number, event: ArrayEvent, note: NotePart[], highlight: Highlight = {}) => {
    steps.push({ state: snapshot(a, { ...highlight, sorted }), event, note, line, counters: { cmp, swp } });
  };

  // Moves a[i] down until it is not smaller than its children (the heap has `size` elements).
  const siftDown = (start: number, size: number) => {
    let i = start;
    while (true) {
      record(10, { type: "phase", name: "sift" }, ["sifting down", ref(i, "pivot")], { pivot: i });
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      for (const child of [l, r]) {
        if (child >= size) continue;
        cmp++;
        record(child === l ? 13 : 15, { type: "compare", i: child, j: largest }, [
          "comparing child",
          ref(child, "compared"),
          "with",
          ref(largest, "compared"),
        ], { compared: [child, largest] });
        if (a[child] > a[largest]) largest = child;
      }

      if (largest === i) {
        const why = l < size ? "is not smaller than its children" : "has no children";
        record(17, { type: "phase", name: "heap" }, [ref(i, "pivot"), why], { pivot: i });
        return;
      }
      [a[i], a[largest]] = [a[largest], a[i]];
      swp++;
      record(18, { type: "swap", i, j: largest }, ["swapped", ref(i, "active"), ref(largest, "active")], {
        active: [i, largest],
      });
      i = largest;
    }
  };

  const n = a.length;
  record(2, { type: "start" }, ["ready"]);

  record(3, { type: "phase", name: "build" }, ["building a max-heap from the bottom"]);
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n);
  record(5, { type: "phase", name: "heap" }, ["max-heap ready, the maximum is", ref(0, "pivot")], { pivot: 0 });

  for (let end = n - 1; end >= 1; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    swp++;
    record(6, { type: "swap", i: 0, j: end }, ["maximum", ref(0, "active"), "goes to", ref(end, "active")], {
      active: [0, end],
    });
    // The maximum of the heap stays at the end for good.
    sorted.push(end);
    record(6, { type: "settle", at: end }, [ref(end, "sorted"), "in place"]);
    siftDown(0, end);
  }

  // The last element of the heap is the smallest one.
  sorted.push(0);
  record(5, { type: "done" }, ["sorted"]);
  return steps;
}
