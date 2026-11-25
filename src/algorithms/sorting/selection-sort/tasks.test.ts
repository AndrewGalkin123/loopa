import { expect, test } from "vitest";
import { randomArrays, solves } from "@/algorithms/testUtils";
import { selectionSortTasks as tasks } from "./tasks";
import { selectionSortTrace as trace } from "./trace";

test("Selection Sort tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "minimum-stays", [1, 8, 3, 7, 2, 6, 4, 5])).toBe(true);
  expect(solves(tasks, trace, "minimum-stays", [2, 1, 3, 4, 5, 6, 7, 8])).toBe(false);
  expect(solves(tasks, trace, "minimum-changes", [8, 7, 6, 5, 4, 3, 2, 1])).toBe(true);
  expect(solves(tasks, trace, "minimum-changes", [8, 7, 6, 5, 4, 3, 1, 2])).toBe(false);
  expect(solves(tasks, trace, "unstable", [5, 5, 1])).toBe(true);
  expect(solves(tasks, trace, "unstable", [5, 1, 5])).toBe(false);
});

test("the impossible task really has no solution: always 28 comparisons on 8 values", () => {
  for (const input of randomArrays(300, 31).map((a) => [...a, 0, 0, 0, 0, 0, 0, 0, 0].slice(0, 8))) {
    expect(solves(tasks, trace, "fewer-comparisons", input)).toBe(false);
    expect(trace(input).at(-1)!.counters.cmp).toBe(28);
  }
});
