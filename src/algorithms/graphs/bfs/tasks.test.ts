import { expect, test } from "vitest";
import { graphFrom, solves } from "@/algorithms/testUtils";
import type { GraphEdge } from "@/models/graph/types";
import { bfsTasks as tasks } from "./tasks";
import { bfsTrace as trace } from "./trace";

const input = (edges: GraphEdge[]) => ({ graph: graphFrom(edges), start: "A" });
const path: GraphEdge[] = [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"]];
const triangle: GraphEdge[] = [["A", "B"], ["B", "C"], ["A", "C"]];

test("BFS tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "far-vertex", input(path))).toBe(true);
  expect(solves(tasks, trace, "far-vertex", input(triangle))).toBe(false);
  expect(solves(tasks, trace, "unreached", input([["A", "B"], ["C", "D"]]))).toBe(true);
  expect(solves(tasks, trace, "unreached", input(triangle))).toBe(false);
  expect(solves(tasks, trace, "wide-queue", input([["A", "B"], ["A", "C"], ["A", "D"], ["A", "E"]]))).toBe(true);
  expect(solves(tasks, trace, "wide-queue", input(path))).toBe(false);
});
