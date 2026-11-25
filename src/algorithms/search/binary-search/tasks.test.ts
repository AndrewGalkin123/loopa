import { expect, test } from "vitest";
import { solves } from "@/algorithms/testUtils";
import { binarySearchTasks as tasks } from "./tasks";
import { binarySearchTrace as trace } from "./trace";

const values = [3, 8, 12, 19, 23, 31, 38, 44, 50, 57, 63, 70, 76, 85, 91];

test("binary search tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "first-try", { values, target: 44 })).toBe(true);
  expect(solves(tasks, trace, "first-try", { values, target: 3 })).toBe(false);
  expect(solves(tasks, trace, "most-tries", { values, target: 3 })).toBe(true);
  expect(solves(tasks, trace, "most-tries", { values, target: 1 })).toBe(true);
  expect(solves(tasks, trace, "most-tries", { values, target: 44 })).toBe(false);
  // 16 elements: ⌊log₂ 16⌋ + 1 = 5 checks for the last one.
  const sixteen = Array.from({ length: 16 }, (_, i) => i + 1);
  expect(solves(tasks, trace, "most-tries", { values: sixteen, target: 16 })).toBe(true);
});
