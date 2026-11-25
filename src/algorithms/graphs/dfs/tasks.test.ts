import { expect, test } from "vitest";
import { graphFrom, solves } from "@/algorithms/testUtils";
import type { GraphEdge } from "@/models/graph/types";
import { dfsTasks as tasks } from "./tasks";
import { dfsTrace as trace } from "./trace";

const input = (edges: GraphEdge[]) => ({ graph: graphFrom(edges), start: "A" });

test("DFS tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "shallow", input([["A", "B"], ["A", "C"], ["A", "D"]]))).toBe(true);
  expect(solves(tasks, trace, "shallow", input([["A", "B"], ["B", "C"], ["C", "D"]]))).toBe(false);
  // Depth 3 (A → B → C) is already too deep.
  expect(solves(tasks, trace, "shallow", input([["A", "B"], ["B", "C"], ["A", "D"]]))).toBe(false);
  // Too small, or not all vertices reached, does not count.
  expect(solves(tasks, trace, "shallow", input([["A", "B"], ["A", "C"]]))).toBe(false);
  expect(solves(tasks, trace, "shallow", input([["A", "B"], ["A", "C"], ["D", "E"]]))).toBe(false);
  expect(solves(tasks, trace, "alphabetical", input([["A", "B"], ["B", "C"], ["C", "D"]]))).toBe(true);
  expect(solves(tasks, trace, "alphabetical", input([["A", "C"], ["C", "B"]]))).toBe(false);
});
