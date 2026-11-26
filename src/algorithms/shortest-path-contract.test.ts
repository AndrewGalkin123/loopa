import { describe, expect, test } from "vitest";
import { CONTENT } from "@/algorithms/content";
import { ALGORITHMS } from "@/algorithms/registry";
import { testWeightedGraphs } from "@/algorithms/testUtils";
import { edgesFrom, sortedEdges } from "@/models/graph/snapshot";
import type { Graph } from "@/models/graph/types";

/*
 * Rules every shortest-path algorithm must follow, checked against an independent
 * reference. A new one is checked automatically, as soon as it is in the registry.
 */
const algorithms = ALGORITHMS.filter((definition) => definition.model === "graph").flatMap((d) =>
  d.weighted ? [{ ...d, weighted: d.weighted }] : [],
);

/** Textbook Bellman–Ford over directed arcs: distances, and whether a reachable negative cycle exists. */
function reference(graph: Graph, start: string) {
  const arcs = graph.nodes.flatMap((n) => edgesFrom(graph, n.id).map((e) => ({ from: n.id, ...e })));
  const distance = Object.fromEntries(graph.nodes.map((n) => [n.id, Infinity]));
  distance[start] = 0;
  for (let i = 0; i < graph.nodes.length; i++) {
    for (const { from, to, weight } of arcs) distance[to] = Math.min(distance[to], distance[from] + weight);
  }
  const negativeCycle = arcs.some(({ from, to, weight }) => distance[from] + weight < distance[to]);
  return { distance, negativeCycle };
}

describe.each(algorithms)("$slug follows the shortest-path contract", (definition) => {
  const graphs = testWeightedGraphs(definition.weighted, 80, 11);
  const pseudocodeLines = CONTENT[definition.slug].cs.pseudocode.length;
  const runs = graphs.flatMap((graph) => graph.nodes.slice(0, 4).map(({ id }) => ({ graph, start: id })));

  test("the distances are the shortest ones and a negative cycle is reported", () => {
    for (const { graph, start } of runs) {
      const last = definition.trace({ graph, start }).at(-1)!.event;
      if (last.type !== "done") throw new Error("the last step must be 'done'");
      const expected = reference(graph, start);
      expect(Boolean(last.negativeCycle)).toBe(expected.negativeCycle);
      if (!expected.negativeCycle) expect(last.distances).toEqual(expected.distance);
    }
  });

  test("the predecessors form real shortest paths", () => {
    for (const { graph, start } of runs) {
      const last = definition.trace({ graph, start }).at(-1)!.event;
      if (last.type !== "done" || last.negativeCycle) continue;
      for (const { id } of graph.nodes) {
        const before = last.previous![id];
        if (id === start || last.distances![id] === Infinity) {
          expect(before).toBeNull();
        } else {
          const edge = edgesFrom(graph, before!).find((e) => e.to === id)!;
          expect(last.distances![before!] + edge.weight).toBe(last.distances![id]);
        }
      }
    }
  });

  test("every step points to an existing pseudocode line and has a status text", () => {
    for (const { graph, start } of runs) {
      for (const step of definition.trace({ graph, start })) {
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

  test("every mark is in the legend, and counters never go down", () => {
    for (const { graph, start } of runs) {
      const steps = definition.trace({ graph, start });
      steps.forEach((step, i) => {
        Object.values(step.state.marks).forEach((mark) => expect(definition.legend).toContain(mark));
        if (i > 0) {
          for (const { key } of definition.counters) {
            expect(step.counters[key]).toBeGreaterThanOrEqual(steps[i - 1].counters[key]);
          }
        }
      });
    }
  });

  test("random graphs respect the weight limits, and those with negative edges have no negative cycle", () => {
    for (const graph of testWeightedGraphs(definition.weighted, 40, 12).slice(definition.weighted.presets.length)) {
      for (const { weight } of sortedEdges(graph)) expect(weight).toBeGreaterThanOrEqual(definition.weighted.minWeight);
      expect(reference(graph, "A").negativeCycle).toBe(false);
      // Everything can be reached from A.
      expect(Object.values(reference(graph, "A").distance)).not.toContain(Infinity);
    }
  });
});
