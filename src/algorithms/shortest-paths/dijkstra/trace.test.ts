import { describe, expect, test } from "vitest";
import { graphFrom, testWeightedGraphs } from "@/algorithms/testUtils";
import { WEIGHTED_PRESETS } from "@/models/graph/presets";
import type { GraphStep } from "@/models/graph/types";
import { dijkstra } from "./definition";
import { dijkstraTrace } from "./trace";

/** Closing order and the result of a run, in the shape printed by docs/research/tools/answer_keys.py. */
function result(steps: GraphStep[]) {
  const closed = steps.flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
  const last = steps.at(-1)!.event;
  if (last.type !== "done") throw new Error("the last step must be 'done'");
  return { closed, distances: last.distances, previous: last.previous };
}

describe("Dijkstra", () => {
  // Expected values printed by answer_keys.py for the two forms of the test.
  test("research form A: closing order, distances and predecessors as in the answer key", () => {
    const graph = graphFrom([
      ["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8],
      ["C", "E", 10], ["D", "E", 2], ["D", "F", 6], ["E", "F", 3],
    ]);
    expect(result(dijkstraTrace({ graph, start: "A" }))).toEqual({
      closed: ["A", "C", "B", "D", "E", "F"],
      distances: { A: 0, B: 3, C: 2, D: 8, E: 10, F: 13 },
      previous: { A: null, B: "C", C: "A", D: "B", E: "D", F: "E" },
    });
  });

  test("research form B: closing order, distances and predecessors as in the answer key", () => {
    const graph = graphFrom([
      ["A", "D", 3], ["A", "B", 7], ["B", "D", 5], ["C", "D", 9], ["B", "E", 1],
      ["B", "C", 4], ["C", "E", 1], ["C", "F", 2], ["E", "F", 8],
    ]);
    expect(result(dijkstraTrace({ graph, start: "A" }))).toEqual({
      closed: ["A", "D", "B", "E", "C", "F"],
      distances: { A: 0, B: 7, C: 9, D: 3, E: 8, F: 11 },
      previous: { A: null, B: "A", C: "E", D: "A", E: "B", F: "C" },
    });
  });

  test("a closed vertex never changes its distance (the reason the greedy choice is safe)", () => {
    for (const graph of testWeightedGraphs(dijkstra.weighted!, 40)) {
      const closed = new Set<string>();
      for (const step of dijkstraTrace({ graph, start: "A" })) {
        if (step.event.type === "visit") closed.add(step.event.node);
        if (step.event.type === "relax") expect(closed.has(step.event.to)).toBe(false);
      }
    }
  });

  test("vertices are closed by non-decreasing distance; equal ones alphabetically", () => {
    for (const graph of testWeightedGraphs(dijkstra.weighted!, 40, 2)) {
      const { closed, distances } = result(dijkstraTrace({ graph, start: "A" }));
      closed.slice(1).forEach((v, i) => {
        const before = closed[i];
        expect(distances![v]).toBeGreaterThanOrEqual(distances![before]);
        if (i > 0 && distances![v] === distances![before]) expect(v > before).toBe(true);
      });
    }
  });

  test("an equally long path does not replace the first one found (the check is strict: <)", () => {
    const graph = graphFrom([["A", "B", 1], ["A", "C", 1], ["B", "D", 1], ["C", "D", 1]]);
    expect(result(dijkstraTrace({ graph, start: "A" })).previous).toEqual({ A: null, B: "A", C: "A", D: "B" });
  });

  test("the unreachable part stays at infinity", () => {
    const components = WEIGHTED_PRESETS.find((p) => p.id === "components")!.graph;
    expect(result(dijkstraTrace({ graph: components, start: "A" })).distances).toEqual({
      A: 0, B: 3, C: 2, D: Infinity, E: Infinity, F: Infinity,
    });
  });
});
