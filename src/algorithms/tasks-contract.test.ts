import { describe, expect, test } from "vitest";
import { ALGORITHMS } from "@/algorithms/registry";
import { randomArrays, testGraphs, testSearchInputs, testWeightedGraphs } from "@/algorithms/testUtils";
import type { Step } from "@/core/types";

/*
 * Rules every task "find an input such that …" must follow. A new algorithm with
 * tasks is checked by these tests automatically, as soon as it is in the registry.
 * (Each module's tasks.test.ts shows a solution of every solvable task.)
 */
const withTasks = ALGORITHMS.filter((definition) => definition.tasks);

function inputsOf(definition: (typeof withTasks)[number]): unknown[] {
  if (definition.model === "array") return [...randomArrays(40, 41), ...randomArrays(40, 42).map((a) => [...a, 1, 2, 3, 4, 5, 6, 7, 8].slice(0, 8))];
  if (definition.model === "search") return testSearchInputs(40, "requiresSorted" in definition && definition.requiresSorted === true, 43);
  const graphs = "weighted" in definition && definition.weighted ? testWeightedGraphs(definition.weighted, 30, 44) : testGraphs(30, 44);
  return graphs.map((graph) => ({ graph, start: "A" }));
}

test("every algorithm has tasks", () => {
  expect(withTasks).toHaveLength(ALGORITHMS.length);
});

describe.each(withTasks)("$slug: tasks follow the rules", (definition) => {
  const tasks = definition.tasks!;

  test("unique ids; a text, a hint and an explanation each", () => {
    expect(new Set(tasks.map((t) => t.id)).size).toBe(tasks.length);
    for (const task of tasks) {
      expect(task.text.length).toBeGreaterThan(0);
      expect(task.hint.length).toBeGreaterThan(0);
      expect(task.explain.length).toBeGreaterThan(0);
    }
  });

  test("the starting data of the player solves no task (nothing is solved for free)", () => {
    const steps = definition.trace(definition.initialInput as never) as Step[];
    for (const task of tasks) expect(task.check(definition.initialInput as never, steps as never).done, task.id).toBe(false);
  });

  test("every check works on any input; an impossible task is never solved", () => {
    for (const input of inputsOf(definition)) {
      const steps = definition.trace(input as never) as Step[];
      for (const task of tasks) {
        const result = task.check(input as never, steps as never);
        expect(typeof result.done).toBe("boolean");
        if (task.impossible) expect(result.done).toBe(false);
      }
    }
  });
});
