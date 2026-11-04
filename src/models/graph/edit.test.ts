import { describe, expect, test } from "vitest";
import { addNode, MAX_NODES, moveNode, nextFreeId, removeNode, setWeight, toggleEdge } from "./edit";
import type { GraphInput } from "./types";

const triangle: GraphInput = {
  graph: {
    nodes: [
      { id: "A", x: 100, y: 100 },
      { id: "B", x: 300, y: 100 },
      { id: "C", x: 200, y: 220 },
    ],
    edges: [["A", "B"], ["B", "C"], ["A", "C"]],
  },
  start: "A",
};

describe("graph editor", () => {
  test("a new vertex gets the first free letter and keeps the vertices in alphabetical order", () => {
    const withoutB = removeNode(triangle, "B");
    const next = addNode(withoutB, 400, 150);
    expect(next.graph.nodes.map((n) => n.id)).toEqual(["A", "B", "C"]);
    expect(next.graph.nodes[1]).toEqual({ id: "B", x: 400, y: 150 });
  });

  test("a vertex is not added too close to another one or outside the picture", () => {
    expect(addNode(triangle, 105, 102)).toBe(triangle);
    const outside = addNode(triangle, -50, 999).graph.nodes.find((n) => n.id === "D")!;
    expect(outside.x).toBeGreaterThan(0);
    expect(outside.y).toBeLessThan(280);
  });

  test(`at most ${MAX_NODES} vertices`, () => {
    let input = triangle;
    for (let i = 0; i < 30; i++) input = addNode(input, 40 + (i % 8) * 90, 60 + Math.floor(i / 8) * 70);
    expect(input.graph.nodes).toHaveLength(MAX_NODES);
    expect(nextFreeId(input.graph)).toBeUndefined();
  });

  test("removing a vertex removes its edges; removing the start moves the start", () => {
    const next = removeNode(triangle, "A");
    expect(next.graph.nodes.map((n) => n.id)).toEqual(["B", "C"]);
    expect(next.graph.edges).toEqual([["B", "C"]]);
    expect(next.start).toBe("B");
  });

  test("the last vertex cannot be removed", () => {
    const single = removeNode(removeNode(triangle, "A"), "B");
    expect(removeNode(single, "C")).toBe(single);
  });

  test("toggling an edge removes it in either direction and adds it back once", () => {
    const without = toggleEdge(triangle, "B", "A");
    expect(without.graph.edges).toEqual([["B", "C"], ["A", "C"]]);
    const back = toggleEdge(without, "B", "A");
    expect(back.graph.edges).toContainEqual(["A", "B"]);
    expect(back.graph.edges).toHaveLength(3);
  });

  test("a vertex cannot be joined to itself", () => {
    expect(toggleEdge(triangle, "C", "C")).toBe(triangle);
  });

  test("moving keeps the vertex inside the picture and leaves the old graph untouched", () => {
    const moved = moveNode(triangle, "C", 2000, -40);
    expect(moved.graph.nodes[2].x).toBeLessThan(760);
    expect(moved.graph.nodes[2].y).toBeGreaterThan(0);
    expect(triangle.graph.nodes[2]).toEqual({ id: "C", x: 200, y: 220 });
  });
});

describe("weighted and directed graphs in the editor", () => {
  const directed: GraphInput = {
    graph: { directed: true, nodes: triangle.graph.nodes, edges: [["B", "A", 5]] },
    start: "A",
  };

  test("a new edge keeps the clicked direction and gets the weight", () => {
    expect(toggleEdge(directed, "C", "A", 1).graph.edges).toContainEqual(["C", "A", 1]);
  });

  test("toggling removes an edge in either direction", () => {
    expect(toggleEdge(directed, "A", "B").graph.edges).toEqual([]);
  });

  test("the weight of an edge can be changed", () => {
    expect(setWeight(directed, "B", "A", -3).graph.edges).toEqual([["B", "A", -3]]);
    expect(directed.graph.edges).toEqual([["B", "A", 5]]);
  });

  test("removing a vertex keeps the graph directed", () => {
    expect(removeNode(directed, "C").graph.directed).toBe(true);
  });
});
