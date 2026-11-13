import { describe, expect, test } from "vitest";
import { graphFrom, testWeightedGraphs } from "@/algorithms/testUtils";
import type { NotePart } from "@/core/types";
import type { GraphEdge } from "@/models/graph/types";
import { dijkstra } from "./definition";
import { dijkstraQuestions } from "./questions";
import { dijkstraTrace } from "./trace";

const text = (parts: NotePart[]) => parts.map((p) => (typeof p === "string" ? p : p.text)).join(" ");

// The graphs of the research test (docs/research/tools/answer_keys.py).
const FORM_A: GraphEdge[] = [
  ["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8],
  ["C", "E", 10], ["D", "E", 2], ["D", "F", 6], ["E", "F", 3],
];
const FORM_B: GraphEdge[] = [
  ["A", "D", 3], ["A", "B", 7], ["B", "D", 5], ["C", "D", 9], ["B", "E", 1],
  ["B", "C", 4], ["C", "E", 1], ["E", "F", 8], ["C", "F", 2],
];

/** The "which vertex is closed next" questions and their answers. */
const nextClosed = (edges: GraphEdge[]) =>
  dijkstraQuestions(dijkstraTrace({ graph: graphFrom(edges), start: "A" })).flatMap((q) =>
    q.answer.kind === "pick" ? [q.answer.correct] : [],
  );

describe("Dijkstra questions", () => {
  // Closing order A C B D E F (form A) and A D B E C F (form B); the last vertex has no rival, so no question.
  test("research forms A and B: the closing order of the answer key", () => {
    expect(nextClosed(FORM_A)).toEqual([["C"], ["B"], ["D"], ["E"]]);
    expect(nextClosed(FORM_B)).toEqual([["D"], ["B"], ["E"], ["C"]]);
  });

  test("the vertex really closed next is always among the right answers", () => {
    for (const graph of testWeightedGraphs(dijkstra.weighted!, 30, 5)) {
      const steps = dijkstraTrace({ graph, start: "A" });
      for (const q of dijkstraQuestions(steps)) {
        const next = steps[q.at + 1].event;
        if (q.answer.kind === "pick") expect(next.type === "visit" && q.answer.correct.includes(next.node)).toBe(true);
        // "Will d[v] decrease?" — yes exactly when the next step is the relaxation.
        if (q.answer.kind === "yes-no") expect(q.answer.correct).toBe(next.type === "relax");
      }
    }
  });

  test("equal distances: every vertex with the smallest d is right", () => {
    const graph = graphFrom([["A", "B", 2], ["A", "C", 2], ["B", "D", 1], ["C", "D", 5]]);
    const [, , tie] = dijkstraQuestions(dijkstraTrace({ graph, start: "A" }));
    expect(tie.answer).toEqual({ kind: "pick", correct: ["B", "C"] });
    expect(text(tie.explain)).toContain("Stejné d má i C");
  });

  test("edges to closed vertices are not asked about; the explanation shows the sum", () => {
    const steps = dijkstraTrace({ graph: graphFrom(FORM_A), start: "A" });
    const questions = dijkstraQuestions(steps);
    const relaxing = questions.filter((q) => q.answer.kind === "yes-no");
    for (const q of relaxing) {
      const event = steps[q.at].event;
      expect(event.type).toBe("examine");
    }
    expect(text(relaxing[0].explain)).toBe("d[A] + w(A, B) = 0 + 4 = 4 < ∞, takže d[B] klesne na 4.");
  });
});
