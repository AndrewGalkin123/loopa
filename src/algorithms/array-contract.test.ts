import { describe, expect, test } from "vitest";
import { CONTENT } from "@/algorithms/content";
import { ALGORITHMS } from "@/algorithms/registry";
import { randomArrays, sortedCopy } from "@/algorithms/testUtils";

/*
 * Rules every algorithm on an array must follow, whatever it does inside.
 * A new sorting algorithm is checked by these tests automatically,
 * as soon as it is in the registry.
 */
const arrayAlgorithms = ALGORITHMS.filter((definition) => definition.model === "array");
const inputs = [...randomArrays(150, 7), [1, 2], [2, 1], [5, 5, 5, 5], [3, 1, 2]];

describe.each(arrayAlgorithms)("$slug follows the array contract", (definition) => {
  const pseudocodeLines = CONTENT[definition.slug].pseudocode.length;

  test("starts with 'start', ends with 'done' and a sorted array", () => {
    for (const input of inputs) {
      const steps = definition.trace(input);
      expect(steps[0].event.type).toBe("start");
      expect(steps.at(-1)!.event.type).toBe("done");
      expect(steps.at(-1)!.state.values).toEqual(sortedCopy(input));
    }
  });

  test("every step shows a permutation of the input (nothing lost, nothing duplicated)", () => {
    for (const input of inputs) {
      const expected = sortedCopy(input);
      for (const step of definition.trace(input)) expect(sortedCopy(step.state.values)).toEqual(expected);
    }
  });

  test("a bar marked 'sorted' already holds its final value", () => {
    for (const input of inputs) {
      const expected = sortedCopy(input);
      for (const step of definition.trace(input)) {
        step.state.values.forEach((value, i) => {
          if (step.state.marks[i] === "sorted") expect(value).toBe(expected[i]);
        });
      }
    }
  });

  test("counters never go down", () => {
    for (const input of inputs) {
      const steps = definition.trace(input);
      steps.slice(1).forEach((step, i) => {
        for (const { key } of definition.counters) {
          expect(step.counters[key]).toBeGreaterThanOrEqual(steps[i].counters[key]);
        }
      });
    }
  });

  test("every step points to an existing pseudocode line and has a status text", () => {
    for (const input of inputs) {
      for (const step of definition.trace(input)) {
        expect(step.line).toBeGreaterThanOrEqual(0);
        expect(step.line).toBeLessThanOrEqual(pseudocodeLines);
        expect(step.note.length).toBeGreaterThan(0);
      }
    }
  });

  test("clicking any line with an alias leads to a line that some step really executes", () => {
    const executed = new Set(definition.trace(definition.initialInput).map((step) => step.line));
    for (const [from, to] of Object.entries(definition.lineAliases)) {
      expect(Number(from)).toBeLessThanOrEqual(pseudocodeLines);
      expect(executed.has(to), `line ${from} → ${to}`).toBe(true);
    }
  });

  test("every mark used in the steps is listed in the legend", () => {
    const used = new Set<string>();
    for (const input of inputs) {
      for (const step of definition.trace(input)) Object.values(step.state.marks).forEach((m) => used.add(m!));
    }
    for (const mark of used) expect(definition.legend).toContain(mark);
  });
});
