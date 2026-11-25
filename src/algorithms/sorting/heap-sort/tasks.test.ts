import { expect, test } from "vitest";
import { solves } from "@/algorithms/testUtils";
import { heapSortTasks as tasks } from "./tasks";
import { heapSortTrace as trace } from "./trace";

test("Heap Sort tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "already-heap", [8, 7, 6, 5, 4, 3, 2, 1])).toBe(true);
  expect(solves(tasks, trace, "already-heap", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
  expect(solves(tasks, trace, "most-build-swaps", [1, 2, 3, 5, 4, 6, 7, 8])).toBe(true);
  expect(solves(tasks, trace, "most-build-swaps", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
});
