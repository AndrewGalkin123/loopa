import { expect, test } from "vitest";
import { graphFrom } from "@/algorithms/testUtils";
import type { GraphEdge } from "@/models/graph/types";
import { dijkstraKeyStates } from "./keyStates";
import { dijkstraTrace } from "./trace";

const closed = (edges: GraphEdge[]) => {
  const steps = dijkstraTrace({ graph: graphFrom(edges), start: "A" });
  return dijkstraKeyStates(steps)
    .slice(1)
    .map((k) => (typeof k.caption[1] === "string" ? k.caption[1] : k.caption[1].text));
};

// The closing order, as printed by docs/research/tools/answer_keys.py.
test("research forms A and B: one picture per closed vertex, in the closing order", () => {
  const formA: GraphEdge[] = [
    ["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8],
    ["C", "E", 10], ["D", "E", 2], ["D", "F", 6], ["E", "F", 3],
  ];
  const formB: GraphEdge[] = [
    ["A", "D", 3], ["A", "B", 7], ["B", "D", 5], ["C", "D", 9], ["B", "E", 1],
    ["B", "C", 4], ["C", "E", 1], ["E", "F", 8], ["C", "F", 2],
  ];
  expect(closed(formA)).toEqual(["A", "C", "B", "D", "E", "F"]);
  expect(closed(formB)).toEqual(["A", "D", "B", "E", "C", "F"]);
});

test("the caption gives the final distance of the closed vertex", () => {
  const steps = dijkstraTrace({ graph: graphFrom([["A", "B", 4], ["A", "C", 1], ["B", "C", 2]]), start: "A" });
  const captions = dijkstraKeyStates(steps).map((k) => k.caption.map((p) => (typeof p === "string" ? p : p.text)).join(" "));
  expect(captions).toEqual(["start A d = 0", "po uzavření A (d = 0) a kontrole jeho hran", "po uzavření C (d = 1) a kontrole jeho hran", "po uzavření B (d = 3) a kontrole jeho hran"]);
});
