import { describe, expect, test } from "vitest";
import { testGraphs } from "@/algorithms/testUtils";
import { edgeKey, neighbours } from "@/models/graph/snapshot";
import type { Graph } from "@/models/graph/types";
import { dfsTrace } from "./trace";

/** Textbook recursive DFS with neighbours in alphabetical order. */
function reference(graph: Graph, start: string) {
  const visited = new Set<string>();
  const order: string[] = [];
  const finished: string[] = [];
  const visit = (u: string) => {
    visited.add(u);
    order.push(u);
    for (const v of neighbours(graph, u)) if (!visited.has(v)) visit(v);
    finished.push(u);
  };
  visit(start);
  return { order, finished };
}

describe("DFS", () => {
  test("visits and finishes vertices in the same order as the textbook recursion", () => {
    for (const graph of testGraphs(40)) {
      for (const { id } of graph.nodes) {
        const steps = dfsTrace({ graph, start: id });
        const order = steps.flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
        const finished = steps.flatMap((s) => (s.event.type === "finish" ? [s.event.node] : []));
        expect({ order, finished }).toEqual(reference(graph, id));
      }
    }
  });

  test("a vertex finishes only after every vertex found from it (visits and finishes nest like brackets)", () => {
    for (const graph of testGraphs(20, 3)) {
      const open: string[] = [];
      for (const step of dfsTrace({ graph, start: "A" })) {
        if (step.event.type === "visit") open.push(step.event.node);
        if (step.event.type === "finish") expect(open.pop()).toBe(step.event.node);
      }
      expect(open).toEqual([]);
    }
  });

  test("on a tree, DFS goes down the whole left branch first", () => {
    const tree = testGraphs(0).find((g) => g.nodes.length === 7)!;
    const order = dfsTrace({ graph: tree, start: "A" }).flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
    expect(order).toEqual(["A", "B", "D", "E", "C", "F", "G"]);
  });

  test("the tree edges join every vertex (except the start) to the vertex it was found from", () => {
    for (const graph of testGraphs(20, 4)) {
      const steps = dfsTrace({ graph, start: "A" });
      const treeEdges = Object.entries(steps.at(-1)!.state.edgeMarks).filter(([, m]) => m === "tree").map(([k]) => k);
      const expected = steps.flatMap((s, i) => {
        if (s.event.type !== "visit") return [];
        const from = steps[i - 1].event; // the visit is right after checking the edge it came through
        return from.type === "examine" ? [edgeKey(from.from, from.to)] : [];
      });
      expect(treeEdges.sort()).toEqual(expected.sort());
    }
  });
});
