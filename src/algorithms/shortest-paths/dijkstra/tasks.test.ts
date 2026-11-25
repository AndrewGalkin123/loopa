import { expect, test } from "vitest";
import { graphFrom, solves } from "@/algorithms/testUtils";
import type { GraphEdge } from "@/models/graph/types";
import { dijkstraTasks as tasks } from "./tasks";
import { dijkstraTrace as trace } from "./trace";

const input = (edges: GraphEdge[]) => ({ graph: graphFrom(edges), start: "A" });
// B is reached for 10 from A, then for 9 through C, then for 7 through D.
const threeWays: GraphEdge[] = [["A", "B", 10], ["A", "C", 1], ["C", "B", 8], ["A", "D", 2], ["D", "B", 5]];

test("Dijkstra tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "three-relaxations", input(threeWays))).toBe(true);
  expect(solves(tasks, trace, "three-relaxations", input([["A", "B", 10], ["A", "C", 1], ["C", "B", 1]]))).toBe(false);
  expect(solves(tasks, trace, "alphabetical", input([["A", "B", 1], ["A", "C", 2], ["A", "D", 3]]))).toBe(true);
  expect(solves(tasks, trace, "alphabetical", input([["A", "B", 2], ["A", "C", 1]]))).toBe(false);
});
