import { describe, expect, test } from "vitest";
import { testSearchInputs } from "@/algorithms/testUtils";
import { binarySearchTrace } from "./trace";

/** Textbook binary search on a closed interval, returning the index and the number of probes. */
function reference(values: number[], target: number) {
  let lo = 0;
  let hi = values.length - 1;
  let probes = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    probes++;
    if (values[mid] === target) return { found: mid, probes };
    if (values[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return { found: null, probes };
}

describe("Binary Search", () => {
  test("same result and number of probes as the textbook algorithm", () => {
    for (const { values, target } of testSearchInputs(300, true)) {
      const steps = binarySearchTrace({ values, target });
      const expected = reference(values, target);
      expect(steps.at(-1)!.event).toEqual({ type: "done", found: expected.found });
      expect(steps.at(-1)!.counters.probes).toBe(expected.probes);
    }
  });

  test("at most ⌊log₂ n⌋ + 1 probes, also when the target is missing", () => {
    for (const { values, target } of testSearchInputs(300, true, 2)) {
      const limit = Math.floor(Math.log2(values.length)) + 1;
      expect(binarySearchTrace({ values, target }).at(-1)!.counters.probes).toBeLessThanOrEqual(limit);
    }
  });

  test("every value of the array can be found (the classic lo < hi bug would miss some)", () => {
    const values = [3, 7, 12, 18, 21, 29, 34, 41];
    values.forEach((target, i) => {
      expect(binarySearchTrace({ values, target }).at(-1)!.event).toEqual({ type: "done", found: i });
    });
  });
});
