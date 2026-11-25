import { expect, test } from "vitest";
import { graphFrom, solves } from "@/algorithms/testUtils";
import type { GraphEdge } from "@/models/graph/types";
import { bellmanFordTasks as tasks } from "./tasks";
import { bellmanFordTrace as trace } from "./trace";

const input = (edges: GraphEdge[]) => ({ graph: { ...graphFrom(edges), directed: true }, start: "A" });

test("Bellman–Ford tasks: a solution and a non-solution of each", () => {
  expect(solves(tasks, trace, "negative-cycle", input([["A", "B", 1], ["B", "C", -3], ["C", "B", 1]]))).toBe(true);
  expect(solves(tasks, trace, "negative-cycle", input([["A", "B", 1], ["B", "C", -3]]))).toBe(false);
  // A path against the alphabetical order of the edges: A → E → D → C → B needs 4 passes, A → D → C → B only 3.
  expect(solves(tasks, trace, "four-passes", input([["A", "E", 1], ["E", "D", 1], ["D", "C", 1], ["C", "B", 1]]))).toBe(true);
  expect(solves(tasks, trace, "four-passes", input([["A", "D", 1], ["D", "C", 1], ["C", "B", 1]]))).toBe(false);
});
