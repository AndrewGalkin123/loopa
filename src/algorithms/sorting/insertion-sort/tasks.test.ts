import { expect, test } from "vitest";
import { solves } from "@/algorithms/testUtils";
import { insertionSortTasks as tasks } from "./tasks";
import { insertionSortTrace as trace } from "./trace";

test("Insertion Sort tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "no-shift", [1, 2, 3, 4, 5, 6])).toBe(true);
  expect(solves(tasks, trace, "no-shift", [2, 1, 3, 4, 5, 6])).toBe(false);
  expect(solves(tasks, trace, "five-shifts", [6, 1, 2, 3, 4, 5])).toBe(true);
  expect(solves(tasks, trace, "five-shifts", [5, 1, 2, 3, 4, 6])).toBe(false);
  expect(solves(tasks, trace, "most-shifts", [6, 5, 4, 3, 2, 1])).toBe(true);
  expect(solves(tasks, trace, "most-shifts", [6, 5, 4, 3, 1, 2])).toBe(false);
});
