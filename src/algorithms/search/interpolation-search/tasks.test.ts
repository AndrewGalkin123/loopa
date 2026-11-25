import { expect, test } from "vitest";
import { solves } from "@/algorithms/testUtils";
import { interpolationSearchTasks as tasks } from "./tasks";
import { interpolationSearchTrace as trace } from "./trace";

const values = [3, 8, 12, 19, 23, 31, 38, 44, 50, 57, 63, 70, 76, 85, 91];

test("interpolation search tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "first-estimate", { values, target: 3 })).toBe(true);
  expect(solves(tasks, trace, "first-estimate", { values, target: 44 })).toBe(false);
  // One huge number at the end: the estimates crawl from the left.
  const skewed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 99];
  expect(solves(tasks, trace, "worse-than-binary", { values: skewed, target: 14 })).toBe(true);
  expect(solves(tasks, trace, "worse-than-binary", { values, target: 44 })).toBe(false);
});
