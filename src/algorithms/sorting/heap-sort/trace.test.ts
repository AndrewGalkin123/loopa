import { describe, expect, test } from "vitest";
import { ascending, randomArrays } from "@/algorithms/testUtils";
import { heapSortTrace } from "./trace";

/** Every parent is at least as big as its children. */
function isMaxHeap(values: number[], size = values.length) {
  return values.slice(0, size).every((value, i) => [2 * i + 1, 2 * i + 2].every((c) => c >= size || value >= values[c]));
}

describe("Heap Sort", () => {
  test("after the build phase the whole array is a max-heap", () => {
    for (const input of randomArrays(300)) {
      const ready = heapSortTrace(input).find((step) => step.line === 5)!;
      expect(isMaxHeap(ready.state.values)).toBe(true);
    }
  });

  test("each extraction takes the maximum from a valid heap and moves it to the end of the heap", () => {
    for (const input of randomArrays(100, 2)) {
      const steps = heapSortTrace(input);
      steps.forEach((step, k) => {
        if (step.line !== 6 || step.event.type !== "swap") return;
        const end = step.event.j;
        // Just before the swap, siftDown has left a max-heap of end + 1 elements.
        expect(isMaxHeap(steps[k - 1].state.values, end + 1)).toBe(true);
        expect(step.state.values[end]).toBe(Math.max(...step.state.values.slice(0, end + 1)));
      });
    }
  });

  test("a small example counted by hand: [1, 2, 3] → 3 comparisons, 4 swaps", () => {
    expect(heapSortTrace([1, 2, 3]).at(-1)!.counters).toEqual({ cmp: 3, swp: 4 });
  });

  test("never more than 2·n·log₂ n comparisons, whatever the input", () => {
    const inputs = [...randomArrays(200, 3), ascending(40), ascending(40).reverse(), Array(40).fill(7)];
    for (const input of inputs) {
      const n = input.length;
      expect(heapSortTrace(input).at(-1)!.counters.cmp).toBeLessThanOrEqual(2 * n * Math.log2(n));
    }
  });
});
