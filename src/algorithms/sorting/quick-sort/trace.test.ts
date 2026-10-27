import { describe, expect, test } from "vitest";
import { ascending, randomArrays, sortedCopy } from "@/algorithms/testUtils";
import { quickSortTrace } from "./trace";

/*
 * The player must show exactly the Quick Sort of the research tests
 * (docs/research/tools/answer_keys.py): Lomuto partition, pivot = last element,
 * A[j] ≤ pivot. `reference` is a line-by-line port of that Python function.
 */
function reference(input: number[]) {
  const a = [...input];
  let comparisons = 0;
  const partitions: number[][] = [];
  const partition = (p: number, r: number) => {
    const x = a[r];
    let i = p - 1;
    for (let j = p; j < r; j++) {
      comparisons++;
      if (a[j] <= x) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    [a[i + 1], a[r]] = [a[r], a[i + 1]];
    partitions.push([...a]);
    return i + 1;
  };
  const qs = (p: number, r: number) => {
    if (p < r) {
      const q = partition(p, r);
      qs(p, q - 1);
      qs(q + 1, r);
    }
  };
  qs(0, a.length - 1);
  return { comparisons, partitions, result: a };
}

/** The array after every partition = after every "pivot settled" step (pseudocode line 14). */
function partitionsOf(input: number[]) {
  return quickSortTrace(input)
    .filter((s) => s.event.type === "settle" && s.line === 14)
    .map((s) => s.state.values);
}

describe("Quick Sort", () => {
  // Expected values printed by answer_keys.py for the two forms of the test.
  test("research form A: 16 comparisons, same partitions as the answer key", () => {
    const input = [5, 2, 8, 1, 9, 3, 7, 4];
    expect(quickSortTrace(input).at(-1)!.counters.cmp).toBe(16);
    expect(partitionsOf(input)).toEqual([
      [2, 1, 3, 4, 9, 8, 7, 5],
      [2, 1, 3, 4, 9, 8, 7, 5],
      [1, 2, 3, 4, 9, 8, 7, 5],
      [1, 2, 3, 4, 5, 8, 7, 9],
      [1, 2, 3, 4, 5, 8, 7, 9],
      [1, 2, 3, 4, 5, 7, 8, 9],
    ]);
  });

  test("research form B: 16 comparisons, same partitions as the answer key", () => {
    const input = [6, 3, 9, 2, 7, 1, 8, 5];
    expect(quickSortTrace(input).at(-1)!.counters.cmp).toBe(16);
    expect(partitionsOf(input)).toEqual([
      [3, 2, 1, 5, 7, 9, 8, 6],
      [1, 2, 3, 5, 7, 9, 8, 6],
      [1, 2, 3, 5, 7, 9, 8, 6],
      [1, 2, 3, 5, 6, 9, 8, 7],
      [1, 2, 3, 5, 6, 7, 8, 9],
      [1, 2, 3, 5, 6, 7, 8, 9],
    ]);
  });

  test("matches the answer-key algorithm on random arrays", () => {
    for (const input of randomArrays(300)) {
      const expected = reference(input);
      expect(quickSortTrace(input).at(-1)!.counters.cmp).toBe(expected.comparisons);
      expect(partitionsOf(input)).toEqual(expected.partitions);
      expect(expected.result).toEqual(sortedCopy(input));
    }
  });

  test("worst case (already sorted, pivot = last): n(n − 1)/2 comparisons", () => {
    expect(quickSortTrace(ascending(12)).at(-1)!.counters.cmp).toBe(66);
  });
});
