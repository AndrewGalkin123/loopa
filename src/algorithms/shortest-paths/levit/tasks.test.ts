import { expect, test } from "vitest";
import { graphFrom, solves } from "@/algorithms/testUtils";
import type { GraphEdge } from "@/models/graph/types";
import { levitTasks as tasks } from "./tasks";
import { levitTrace as trace } from "./trace";

const input = (edges: GraphEdge[]) => ({ graph: { ...graphFrom(edges), directed: true }, start: "A" });

test("Levit tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "processed-once", input([["A", "B", 1], ["B", "C", 1], ["C", "D", 1]]))).toBe(true);
  // B is processed with d = 5 before the shorter way through C (1 + 1) is found, so it comes back from M0.
  expect(solves(tasks, trace, "processed-once", input([["A", "B", 5], ["A", "C", 1], ["C", "B", 1], ["C", "D", 1]]))).toBe(false);
  expect(solves(tasks, trace, "processed-once", input([["A", "B", 1], ["B", "C", 1]]))).toBe(false);
  expect(solves(tasks, trace, "negative-cycle", input([["A", "B", 1], ["B", "C", -3], ["C", "B", 1]]))).toBe(true);
  expect(solves(tasks, trace, "negative-cycle", input([["A", "B", 1], ["B", "C", -3]]))).toBe(false);
});
