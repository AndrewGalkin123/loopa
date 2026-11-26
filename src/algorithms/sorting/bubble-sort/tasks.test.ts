import { expect, test } from "vitest";
import { solves } from "@/algorithms/testUtils";
import { bubbleSortTasks as tasks } from "./tasks";
import { bubbleSortTrace as trace } from "./trace";

test("Bubble Sort tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "one-pass", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
  expect(solves(tasks, trace, "one-pass", [2, 1, 3, 4, 5, 6, 7, 8])).toBe(false);
  expect(solves(tasks, trace, "most-swaps", [8, 7, 6, 5, 4, 3, 2, 1])).toBe(true);
  expect(solves(tasks, trace, "most-swaps", [8, 7, 6, 5, 4, 3, 1, 2])).toBe(false);
  expect(solves(tasks, trace, "one-swap", [1, 2, 3, 5, 4, 6, 7, 8])).toBe(true);
  expect(solves(tasks, trace, "one-swap", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
});

test("a task about length 8 asks for the length first", () => {
  expect(tasks[0].check([1, 2, 3], trace([1, 2, 3]))).toEqual({
    done: false,
    status: { cs: "nastav velikost pole na 8", en: "set the array size to 8" },
  });
});
