import { describe, expect, test } from "vitest";
import { ascending, inversions, randomArrays, sortedCopy } from "@/algorithms/testUtils";
import { insertionSortTrace } from "./trace";

/** The array after each pass: the step that places the key (line 8). */
const passesOf = (input: number[]) =>
  insertionSortTrace(input)
    .filter((step) => step.line === 8)
    .map((step) => step.state.values);

describe("Insertion Sort", () => {
  test("makes exactly as many shifts as the input has inversions", () => {
    for (const input of randomArrays(300)) {
      const last = insertionSortTrace(input).at(-1)!;
      expect(last.state.values).toEqual(sortedCopy(input));
      expect(last.counters.shf).toBe(inversions(input));
    }
  });

  test("best case (already sorted): n − 1 comparisons, no shift", () => {
    expect(insertionSortTrace(ascending(10)).at(-1)!.counters).toEqual({ cmp: 9, shf: 0 });
  });

  test("worst case (reversed): n(n − 1)/2 comparisons and shifts", () => {
    expect(insertionSortTrace(ascending(10).reverse()).at(-1)!.counters).toEqual({ cmp: 45, shf: 45 });
  });

  test("after pass i the first i + 1 values are the sorted first values of the input (the invariant)", () => {
    for (const input of randomArrays(100, 2)) {
      passesOf(input).forEach((values, pass) => {
        const i = pass + 1;
        expect(values.slice(0, i + 1)).toEqual(sortedCopy(input.slice(0, i + 1)));
        expect(values.slice(i + 1)).toEqual(input.slice(i + 1));
      });
    }
  });

  // Expected values printed by docs/research/tools/answer_keys.py for the two forms of the test.
  test("research form A: 10 shifts, same passes as the answer key", () => {
    const input = [7, 3, 5, 1, 6, 2];
    expect(insertionSortTrace(input).at(-1)!.counters.shf).toBe(10);
    expect(passesOf(input)).toEqual([
      [3, 7, 5, 1, 6, 2],
      [3, 5, 7, 1, 6, 2],
      [1, 3, 5, 7, 6, 2],
      [1, 3, 5, 6, 7, 2],
      [1, 2, 3, 5, 6, 7],
    ]);
  });

  test("research form B: 9 shifts, same passes as the answer key", () => {
    const input = [8, 2, 6, 4, 9, 1];
    expect(insertionSortTrace(input).at(-1)!.counters.shf).toBe(9);
    expect(passesOf(input)).toEqual([
      [2, 8, 6, 4, 9, 1],
      [2, 6, 8, 4, 9, 1],
      [2, 4, 6, 8, 9, 1],
      [2, 4, 6, 8, 9, 1],
      [1, 2, 4, 6, 8, 9],
    ]);
  });
});
