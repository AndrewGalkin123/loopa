import { describe, expect, test } from "vitest";
import { ALGORITHMS } from "@/algorithms/registry";
import { randomArrays, testGraphs, testWeightedGraphs } from "@/algorithms/testUtils";
import type { Step } from "@/core/types";

/* Still pictures of the research (control condition): rules every algorithm with them must follow. */
const withPictures = ALGORITHMS.filter((definition) => definition.keyStates);

function runs(definition: (typeof withPictures)[number]): Step[][] {
  if (definition.model === "array") return randomArrays(40, 21).map((input) => definition.trace(input as never) as Step[]);
  const graphs = "weighted" in definition && definition.weighted ? testWeightedGraphs(definition.weighted, 20, 22) : testGraphs(20, 22);
  return graphs.map((graph) => definition.trace({ graph, start: "A" } as never) as Step[]);
}

test("the research algorithms have still pictures for the control condition", () => {
  expect(withPictures.map((d) => d.slug).sort()).toEqual(["bfs", "dijkstra", "insertion-sort", "quick-sort"]);
});

describe.each(withPictures)("$slug: still pictures", (definition) => {
  test("start with the input, follow the run in order, each has a caption", () => {
    for (const steps of runs(definition)) {
      const states = definition.keyStates!(steps as never);
      expect(states[0].step).toBe(0);
      states.forEach((k, i) => {
        expect(k.step).toBeLessThan(steps.length);
        if (i > 0) expect(k.step).toBeGreaterThan(states[i - 1].step);
        expect(k.caption.length).toBeGreaterThan(0);
      });
    }
  });
});
