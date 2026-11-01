import { describe, expect, test } from "vitest";
import { testSearchInputs } from "@/algorithms/testUtils";
import { linearSearchTrace } from "./trace";

describe("Linear Search", () => {
  test("stops at the first occurrence after exactly index + 1 probes", () => {
    for (const input of testSearchInputs(200, false)) {
      const steps = linearSearchTrace(input);
      const index = input.values.indexOf(input.target);
      expect(steps.at(-1)!.counters.probes).toBe(index === -1 ? input.values.length : index + 1);
      const last = steps.at(-1)!.event;
      expect(last).toEqual({ type: "done", found: index === -1 ? null : index });
    }
  });

  test("finds the first of equal values", () => {
    expect(linearSearchTrace({ values: [4, 9, 9, 9], target: 9 }).at(-1)!.event).toEqual({ type: "done", found: 1 });
  });
});
