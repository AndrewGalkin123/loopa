import { describe, expect, test } from "vitest";
import { mulberry32 } from "@/lib/random";
import { MAX_RANDOM_NODES, maxRandomEdges, MIN_RANDOM_NODES, randomGraph } from "./presets";
import { neighbours } from "./snapshot";
import type { Graph } from "./types";

function isConnected(graph: Graph): boolean {
  const seen = new Set([graph.nodes[0].id]);
  const todo = [graph.nodes[0].id];
  while (todo.length > 0) {
    for (const v of neighbours(graph, todo.pop()!)) {
      if (!seen.has(v)) {
        seen.add(v);
        todo.push(v);
      }
    }
  }
  return seen.size === graph.nodes.length;
}

/** Do the segments p1–p2 and p3–p4 cross (touching at a shared vertex does not count)? */
function cross(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  const d = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  return d(p1, p2, p3) * d(p1, p2, p4) < 0 && d(p3, p4, p1) * d(p3, p4, p2) < 0;
}
type Point = { x: number; y: number };

describe("random graph", () => {
  const random = mulberry32(5);

  test("has exactly the chosen number of vertices and edges, is connected and has no duplicate edges", () => {
    for (let n = MIN_RANDOM_NODES; n <= MAX_RANDOM_NODES; n++) {
      for (let m = n - 1; m <= maxRandomEdges(n); m++) {
        const graph = randomGraph(n, m, random);
        expect(graph.nodes).toHaveLength(n);
        expect(graph.edges).toHaveLength(m);
        expect(isConnected(graph)).toBe(true);
        const keys = graph.edges.map(([a, b]) => [a, b].sort().join());
        expect(new Set(keys).size).toBe(m);
      }
    }
  });

  test("edges never cross each other", () => {
    for (let n = MIN_RANDOM_NODES; n <= MAX_RANDOM_NODES; n++) {
      const graph = randomGraph(n, maxRandomEdges(n), random);
      const at = new Map(graph.nodes.map((v) => [v.id, v]));
      for (const [a, b] of graph.edges) {
        for (const [c, d] of graph.edges) {
          expect(cross(at.get(a)!, at.get(b)!, at.get(c)!, at.get(d)!)).toBe(false);
        }
      }
    }
  });

  test("a number of edges outside the allowed range is moved into it", () => {
    expect(randomGraph(8, 1, random).edges).toHaveLength(7);
    expect(randomGraph(8, 999, random).edges).toHaveLength(maxRandomEdges(8));
  });
});
