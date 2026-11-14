import { expect, test } from "vitest";
import { graphFrom } from "@/algorithms/testUtils";
import type { GraphEdge } from "@/models/graph/types";
import { bfsKeyStates } from "./keyStates";
import { bfsTrace } from "./trace";

const queues = (edges: GraphEdge[]) => {
  const steps = bfsTrace({ graph: graphFrom(edges), start: "A" });
  return bfsKeyStates(steps)
    .slice(1)
    .map((k) => steps[k.step].state.lists[0].items);
};

// The queue after every processed vertex, as printed by docs/research/tools/answer_keys.py.
test("research forms A and B: the queue after every processed vertex", () => {
  expect(queues([["A", "B"], ["A", "D"], ["B", "F"], ["C", "D"], ["C", "G"], ["D", "E"], ["E", "G"], ["F", "G"]])).toEqual([
    ["B", "D"], ["D", "F"], ["F", "C", "E"], ["C", "E", "G"], ["E", "G"], ["G"], [],
  ]);
  expect(queues([["A", "C"], ["A", "F"], ["B", "C"], ["B", "E"], ["C", "D"], ["D", "G"], ["E", "G"], ["F", "G"]])).toEqual([
    ["C", "F"], ["F", "B", "D"], ["B", "D", "G"], ["D", "G", "E"], ["G", "E"], ["E"], [],
  ]);
});
