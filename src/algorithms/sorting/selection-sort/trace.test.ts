import { describe, expect, test } from "vitest";
import { ascending, randomArrays, sortedCopy } from "@/algorithms/testUtils";
import { selectionSortTrace } from "./trace";

describe("Selection Sort", () => {
  test("always n(n − 1)/2 comparisons and n − 1 swaps, whatever the input", () => {
    const inputs = [...randomArrays(300), ascending(12), ascending(12).reverse()];
    for (const input of inputs) {
      const n = input.length;
      const last = selectionSortTrace(input).at(-1)!;
      expect(last.state.values).toEqual(sortedCopy(input));
      expect(last.counters).toEqual({ cmp: (n * (n - 1)) / 2, swp: n - 1 });
    }
  });

  test("after pass i position i holds the minimum of the rest (the invariant)", () => {
    for (const input of randomArrays(100, 2)) {
      const expected = sortedCopy(input);
      const settled = selectionSortTrace(input).filter((step) => step.event.type === "settle");
      expect(settled).toHaveLength(input.length - 1);
      settled.forEach((step, i) => expect(step.state.values.slice(0, i + 1)).toEqual(expected.slice(0, i + 1)));
    }
  });

  test("the marked minimum is the smallest value seen so far in the pass", () => {
    const steps = selectionSortTrace([6, 2, 9, 1, 5]);
    const minimums = steps.filter((s) => s.event.type === "phase" && s.event.name === "minimum").slice(0, 2);
    expect(minimums.map((s) => s.note)).toEqual([
      ["new minimum", { text: "[1]", mark: "pivot" }],
      ["new minimum", { text: "[3]", mark: "pivot" }],
    ]);
  });

  test("it is not stable: a swap can jump over an equal value", () => {
    // The 5 at index 0 ends up behind the 5 at index 1.
    const firstSwap = selectionSortTrace([5, 5, 1]).find((s) => s.event.type === "swap")!;
    expect(firstSwap.event).toEqual({ type: "swap", i: 0, j: 2 });
    expect(firstSwap.state.values).toEqual([1, 5, 5]);
  });
});
