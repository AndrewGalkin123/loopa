import { describe, expect, test } from "vitest";
import { sortedEdges } from "@/models/graph/snapshot";
import { DIRECTED_PRESETS } from "@/models/graph/presets";
import { bellmanFordTrace } from "./trace";

const preset = (id: string) => DIRECTED_PRESETS.find((p) => p.id === id)!.graph;

describe("Bellman-Ford", () => {
  test("handles negative edges", () => {
    const last = bellmanFordTrace({ graph: preset("negative"), start: "A" }).at(-1)!.event;
    expect(last).toMatchObject({ type: "done", distances: { A: 0, B: 2, C: 5, D: 5, E: 11, F: 7, G: 8 } });
  });

  test("reports the negative cycle and the cycle really has a negative sum", () => {
    const graph = preset("neg-cycle");
    const steps = bellmanFordTrace({ graph, start: "A" });
    const last = steps.at(-1)!;
    expect(last.event).toMatchObject({ type: "done", negativeCycle: true });
    const cycle = String(last.note[1]).split(" → ");
    expect(cycle.length).toBeGreaterThan(1);
    const weight = (a: string, b: string) => sortedEdges(graph).find((e) => e.from === a && e.to === b)!.weight;
    const sum = cycle.reduce((total, v, i) => total + weight(v, cycle[(i + 1) % cycle.length]), 0);
    expect(sum).toBeLessThan(0);
  });

  test("ends early after a pass without a change", () => {
    // The edges are already in the best order: pass 1 does everything, pass 2 only confirms it.
    const graph = {
      directed: true,
      nodes: ["A", "B", "C", "D"].map((id) => ({ id, x: 0, y: 0 })),
      edges: [["A", "B", 1], ["B", "C", 1], ["C", "D", 1]] as [string, string, number][],
    };
    const last = bellmanFordTrace({ graph, start: "A" }).at(-1)!;
    expect(last.counters.pass).toBe(2);
    expect(last.line).toBe(11);
  });

  test("never makes more than V − 1 passes", () => {
    for (const { graph } of DIRECTED_PRESETS) {
      expect(bellmanFordTrace({ graph, start: "A" }).at(-1)!.counters.pass).toBeLessThanOrEqual(graph.nodes.length - 1);
    }
  });
});
