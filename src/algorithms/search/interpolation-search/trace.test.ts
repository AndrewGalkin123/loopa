import { describe, expect, test } from "vitest";
import { testSearchInputs } from "@/algorithms/testUtils";
import { makeValues } from "@/models/search/datasets";
import { interpolationSearchTrace } from "./trace";

const probesOf = (values: number[], target: number) =>
  interpolationSearchTrace({ values, target }).at(-1)!.counters.probes;

describe("Interpolation Search", () => {
  test("every value of the array can be found", () => {
    for (const { values } of testSearchInputs(100, true, 3)) {
      for (const target of values) {
        const last = interpolationSearchTrace({ values, target }).at(-1)!.event;
        expect(last.type === "done" && values[last.found!]).toBe(target);
      }
    }
  });

  test("the estimated position is computed by the formula from the pseudocode", () => {
    const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const estimate = interpolationSearchTrace({ values, target: 70 }).find((s) => s.event.type === "estimate")!;
    expect(estimate.event).toEqual({ type: "estimate", position: 6 });
    expect(estimate.line).toBe(7);
  });

  test("equal end values do not divide by zero", () => {
    const steps = interpolationSearchTrace({ values: [5, 5, 5], target: 5 });
    expect(steps.some((s) => s.line === 5)).toBe(true);
    expect(steps.at(-1)!.event).toEqual({ type: "done", found: 0 });
  });

  test("a target outside the values ends without looking at the array", () => {
    expect(probesOf([10, 20, 30], 99)).toBe(0);
    expect(probesOf([10, 20, 30], 1)).toBe(0);
  });

  test("uniform data: found in very few probes; skewed data needs many more", () => {
    for (const n of [15, 25, 40]) {
      const average = (values: number[]) => values.reduce((sum, t) => sum + probesOf(values, t), 0) / n;
      const uniform = average(makeValues("uniform", n));
      const skewed = average(makeValues("skewed", n));
      expect(uniform).toBeLessThan(2);
      expect(skewed).toBeGreaterThan(2 * uniform);
    }
  });
});
