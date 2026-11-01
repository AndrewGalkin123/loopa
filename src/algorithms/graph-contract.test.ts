import { describe, expect, test } from "vitest";
import { CONTENT } from "@/algorithms/content";
import { ALGORITHMS } from "@/algorithms/registry";
import { testGraphs } from "@/algorithms/testUtils";
import { neighbours } from "@/models/graph/snapshot";
import type { Graph } from "@/models/graph/types";

/*
 * Rules every traversal of a graph must follow. A new graph algorithm is
 * checked by these tests automatically, as soon as it is in the registry.
 */
const graphAlgorithms = ALGORITHMS.filter((definition) => definition.model === "graph");
const graphs = testGraphs(30, 9);

/** Vertices reachable from `start`. */
function reachable(graph: Graph, start: string): Set<string> {
  const seen = new Set([start]);
  const todo = [start];
  while (todo.length > 0) {
    for (const v of neighbours(graph, todo.pop()!)) {
      if (!seen.has(v)) {
        seen.add(v);
        todo.push(v);
      }
    }
  }
  return seen;
}

describe.each(graphAlgorithms)("$slug follows the graph contract", (definition) => {
  const pseudocodeLines = CONTENT[definition.slug].pseudocode.length;

  test("starts with 'start' and ends with 'done'", () => {
    for (const graph of graphs) {
      const steps = definition.trace({ graph, start: "A" });
      expect(steps[0].event.type).toBe("start");
      expect(steps.at(-1)!.event.type).toBe("done");
    }
  });

  test("visits every reachable vertex exactly once and nothing else", () => {
    for (const graph of graphs) {
      for (const { id } of graph.nodes) {
        const visits = definition.trace({ graph, start: id }).flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
        expect(visits.length).toBe(new Set(visits).size);
        expect(new Set(visits)).toEqual(reachable(graph, id));
      }
    }
  });

  test("at the end every reached vertex is done and the others are untouched", () => {
    for (const graph of graphs) {
      const last = definition.trace({ graph, start: "A" }).at(-1)!;
      const reached = reachable(graph, "A");
      for (const { id } of graph.nodes) expect(last.state.marks[id]).toBe(reached.has(id) ? "done" : undefined);
    }
  });

  test("checks every edge of the reached part twice (once from each end)", () => {
    for (const graph of graphs) {
      const reached = reachable(graph, "A");
      const edgesInside = graph.edges.filter(([a]) => reached.has(a)).length;
      expect(definition.trace({ graph, start: "A" }).at(-1)!.counters.edges).toBe(2 * edgesInside);
    }
  });

  test("every step points to an existing pseudocode line and has a status text", () => {
    for (const graph of graphs) {
      for (const step of definition.trace({ graph, start: "A" })) {
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
    for (const graph of graphs) {
      for (const step of definition.trace({ graph, start: "A" })) Object.values(step.state.marks).forEach((m) => used.add(m!));
    }
    for (const mark of used) expect(definition.legend).toContain(mark);
  });

  test("counters never go down", () => {
    for (const graph of graphs) {
      const steps = definition.trace({ graph, start: "A" });
      steps.slice(1).forEach((step, i) => {
        for (const { key } of definition.counters) expect(step.counters[key]).toBeGreaterThanOrEqual(steps[i].counters[key]);
      });
    }
  });
});
