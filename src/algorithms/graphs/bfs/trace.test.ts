import { describe, expect, test } from "vitest";
import { graphFrom, testGraphs } from "@/algorithms/testUtils";
import { neighbours } from "@/models/graph/snapshot";
import type { Graph, GraphStep } from "@/models/graph/types";
import { bfsTrace } from "./trace";

/*
 * The player must show exactly the BFS of the research tests
 * (docs/research/tools/answer_keys.py): neighbours in alphabetical order,
 * visited when put into the queue. `reference` is a port of that Python function.
 */
function reference(graph: Graph, start: string) {
  const visited = new Set([start]);
  const dist: Record<string, number> = { [start]: 0 };
  const queue = [start];
  const order: string[] = [];
  const queueAfter: string[][] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of neighbours(graph, u)) {
      if (!visited.has(v)) {
        visited.add(v);
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
    queueAfter.push([...queue]);
  }
  return { order, dist, queueAfter };
}

/** What the player showed: visit order, distances and the queue after each processed vertex. */
function shown(steps: GraphStep[]) {
  const order = steps.flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
  const badges = steps.at(-1)!.state.badges;
  const dist = Object.fromEntries(Object.entries(badges).map(([v, label]) => [v, Number(label!.slice(2))]));
  const queueAfter = steps
    .filter((s, i) => (i > 0 && steps[i + 1]?.event.type === "visit") || s.event.type === "done")
    .map((s) => s.state.lists[0].items);
  return { order, dist, queueAfter };
}

describe("BFS", () => {
  // Expected values printed by answer_keys.py for the two forms of the test.
  test("research form A: order, distances and queue as in the answer key", () => {
    const graph = graphFrom([["A", "B"], ["A", "D"], ["B", "F"], ["C", "D"], ["C", "G"], ["D", "E"], ["E", "G"], ["F", "G"]]);
    expect(shown(bfsTrace({ graph, start: "A" }))).toEqual({
      order: ["A", "B", "D", "F", "C", "E", "G"],
      dist: { A: 0, B: 1, C: 2, D: 1, E: 2, F: 2, G: 3 },
      queueAfter: [["B", "D"], ["D", "F"], ["F", "C", "E"], ["C", "E", "G"], ["E", "G"], ["G"], []],
    });
  });

  test("research form B: order, distances and queue as in the answer key", () => {
    const graph = graphFrom([["A", "C"], ["A", "F"], ["B", "C"], ["B", "E"], ["C", "D"], ["D", "G"], ["E", "G"], ["F", "G"]]);
    expect(shown(bfsTrace({ graph, start: "A" }))).toEqual({
      order: ["A", "C", "F", "B", "D", "G", "E"],
      dist: { A: 0, B: 2, C: 1, D: 2, E: 3, F: 1, G: 2 },
      queueAfter: [["C", "F"], ["F", "B", "D"], ["B", "D", "G"], ["D", "G", "E"], ["G", "E"], ["E"], []],
    });
  });

  test("matches the answer-key algorithm on prepared and random graphs, from every start vertex", () => {
    for (const graph of testGraphs(40)) {
      for (const { id } of graph.nodes) {
        expect(shown(bfsTrace({ graph, start: id }))).toEqual(reference(graph, id));
      }
    }
  });

  test("every vertex enters the queue at most once", () => {
    for (const graph of testGraphs(20, 2)) {
      const found = bfsTrace({ graph, start: "A" }).flatMap((s) => (s.event.type === "discover" ? [s.event.node] : []));
      expect(new Set(found).size).toBe(found.length);
    }
  });
});
