import { describe, expect, test } from "vitest";
import { CONTENT } from "@/algorithms/content";
import { ALGORITHMS } from "@/algorithms/registry";
import { testSearchInputs } from "@/algorithms/testUtils";

/*
 * Rules every search algorithm must follow. A new one is checked by these
 * tests automatically, as soon as it is in the registry.
 */
const searchAlgorithms = ALGORITHMS.filter((definition) => definition.model === "search");

describe.each(searchAlgorithms)("$slug follows the search contract", (definition) => {
  const pseudocodeLines = CONTENT[definition.slug].cs.pseudocode.length;
  const inputs = [
    ...testSearchInputs(300, definition.requiresSorted),
    { values: [5, 5, 5, 5], target: 5 },
    { values: [5, 5, 5, 5], target: 4 },
    { values: [1, 2], target: 3 },
    { values: [1, 2], target: 0 },
  ];

  test("finds the target when it is in the array and reports it when it is not", () => {
    for (const input of inputs) {
      const steps = definition.trace(input);
      expect(steps[0].event.type).toBe("start");
      const last = steps.at(-1)!.event;
      if (last.type !== "done") throw new Error("the last step must be 'done'");
      if (input.values.includes(input.target)) expect(input.values[last.found!]).toBe(input.target);
      else expect(last.found).toBeNull();
    }
  });

  test("the target is never ruled out while it is in the array", () => {
    for (const input of inputs) {
      for (const step of definition.trace(input)) {
        if (!input.values.includes(input.target)) continue;
        const stillPossible = input.values.some((v, i) => v === input.target && step.state.marks[i] !== "dimmed");
        expect(stillPossible).toBe(true);
      }
    }
  });

  test("the number of candidates never grows and probes never go down", () => {
    for (const input of inputs) {
      const steps = definition.trace(input);
      steps.slice(1).forEach((step, i) => {
        expect(step.counters.left).toBeLessThanOrEqual(steps[i].counters.left);
        expect(step.counters.probes).toBeGreaterThanOrEqual(steps[i].counters.probes);
      });
    }
  });

  test("every probe is a real position and every step has an existing line and a status text", () => {
    for (const input of inputs) {
      for (const step of definition.trace(input)) {
        if (step.event.type === "probe") {
          expect(step.event.index).toBeGreaterThanOrEqual(0);
          expect(step.event.index).toBeLessThan(input.values.length);
        }
        expect(step.line).toBeGreaterThan(0);
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

  test("the initial array is sorted if the algorithm needs it", () => {
    if (!definition.requiresSorted) return;
    const { values } = definition.initialInput;
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });
});
