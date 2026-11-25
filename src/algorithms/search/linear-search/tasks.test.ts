import { expect, test } from "vitest";
import { solves } from "@/algorithms/testUtils";
import { linearSearchTasks as tasks } from "./tasks";
import { linearSearchTrace as trace } from "./trace";

const values = [3, 8, 12, 19, 23, 31, 38, 44, 50, 57, 63, 70, 76, 85, 91];

test("linear search tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "first-try", { values, target: 3 })).toBe(true);
  expect(solves(tasks, trace, "first-try", { values, target: 8 })).toBe(false);
  expect(solves(tasks, trace, "every-element", { values, target: 91 })).toBe(true);
  expect(solves(tasks, trace, "every-element", { values, target: 100 })).toBe(true);
  expect(solves(tasks, trace, "every-element", { values, target: 85 })).toBe(false);
});
