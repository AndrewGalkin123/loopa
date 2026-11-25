import { expect, test } from "vitest";
import { randomArrays, solves } from "@/algorithms/testUtils";
import { mergeSortTasks as tasks } from "./tasks";
import { mergeSortTrace as trace } from "./trace";

test("Merge Sort tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "fewest-comparisons", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
  expect(solves(tasks, trace, "fewest-comparisons", [1, 5, 3, 7, 2, 6, 4, 8])).toBe(false);
  expect(solves(tasks, trace, "most-comparisons", [1, 5, 3, 7, 2, 6, 4, 8])).toBe(true);
  expect(solves(tasks, trace, "most-comparisons", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
});

test("the impossible task really has no solution: always 24 writes on 8 values", () => {
  for (const input of randomArrays(300, 32).map((a) => [...a, 0, 0, 0, 0, 0, 0, 0, 0].slice(0, 8))) {
    expect(solves(tasks, trace, "other-writes", input)).toBe(false);
    expect(trace(input).at(-1)!.counters.wrt).toBe(24);
  }
});
