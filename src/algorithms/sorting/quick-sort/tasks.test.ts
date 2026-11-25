import { expect, test } from "vitest";
import { solves } from "@/algorithms/testUtils";
import { quickSortTasks as tasks } from "./tasks";
import { quickSortTrace as trace } from "./trace";

test("Quick Sort tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "most-comparisons", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
  expect(solves(tasks, trace, "most-comparisons", [1, 2, 4, 3, 7, 6, 8, 5])).toBe(false);
  expect(solves(tasks, trace, "fewest-comparisons", [1, 2, 4, 3, 7, 6, 8, 5])).toBe(true);
  expect(solves(tasks, trace, "fewest-comparisons", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
  expect(solves(tasks, trace, "pivot-in-middle", [1, 2, 3, 8, 7, 6, 5, 4])).toBe(true);
  expect(solves(tasks, trace, "pivot-in-middle", [1, 2, 3, 4, 8, 7, 6, 5])).toBe(true);
  expect(solves(tasks, trace, "pivot-in-middle", [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
});

test("13 comparisons really is the least: no array of 8 values 1–4 needs fewer (duplicates included)", () => {
  let fewest = Infinity;
  for (let code = 0; code < 4 ** 8; code++) {
    const input = Array.from({ length: 8 }, (_, i) => 1 + (Math.floor(code / 4 ** i) % 4));
    fewest = Math.min(fewest, trace(input).at(-1)!.counters.cmp);
  }
  expect(fewest).toBe(13);
});
