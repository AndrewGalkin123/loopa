import { describe, expect, test } from "vitest";
import { ascending, inversions, randomArrays, sortedCopy } from "@/algorithms/testUtils";
import { bubbleSortTrace } from "./trace";

describe("Bubble Sort", () => {
  test("makes exactly as many swaps as the input has inversions", () => {
    for (const input of randomArrays(300)) {
      const last = bubbleSortTrace(input).at(-1)!;
      expect(last.state.values).toEqual(sortedCopy(input));
      expect(last.counters.swp).toBe(inversions(input));
    }
  });

  test("best case (already sorted): one pass, n − 1 comparisons, no swap", () => {
    const steps = bubbleSortTrace(ascending(10));
    expect(steps.at(-1)!.counters).toEqual({ cmp: 9, swp: 0 });
    expect(steps.filter((s) => s.event.type === "phase")).toHaveLength(1);
  });

  test("worst case (reversed): n(n − 1)/2 comparisons and swaps", () => {
    const steps = bubbleSortTrace(ascending(10).reverse());
    expect(steps.at(-1)!.counters).toEqual({ cmp: 45, swp: 45 });
  });

  test("after each pass the element that settled holds its final value (the invariant)", () => {
    for (const input of randomArrays(100, 2)) {
      const expected = sortedCopy(input);
      for (const step of bubbleSortTrace(input)) {
        if (step.event.type === "settle") expect(step.state.values[step.event.at]).toBe(expected[step.event.at]);
      }
    }
  });
});
