import { describe, expect, test } from "vitest";
import { graphFrom, testGraphs } from "@/algorithms/testUtils";
import type { NotePart } from "@/core/types";
import type { GraphEdge } from "@/models/graph/types";
import { bfsQuestions } from "./questions";
import { bfsTrace } from "./trace";

const text = (parts: NotePart[]) => parts.map((p) => (typeof p === "string" ? p : p.text)).join(" ");
const answersFor = (edges: GraphEdge[]) =>
  bfsQuestions(bfsTrace({ graph: graphFrom(edges), start: "A" })).map((q) => (q.answer.kind === "sequence" ? q.answer.correct : []));

// The graphs of the research test (docs/research/tools/answer_keys.py).
const FORM_A: GraphEdge[] = [["A", "B"], ["A", "D"], ["B", "F"], ["C", "D"], ["C", "G"], ["D", "E"], ["E", "G"], ["F", "G"]];
const FORM_B: GraphEdge[] = [["A", "C"], ["A", "F"], ["B", "C"], ["B", "E"], ["C", "D"], ["D", "G"], ["E", "G"], ["F", "G"]];

describe("BFS questions", () => {
  test("research forms A and B: what each vertex puts into the queue", () => {
    // Processing order A B D F C E G (form A) and A C F B D G E (form B).
    expect(answersFor(FORM_A)).toEqual([["B", "D"], ["F"], ["C", "E"], ["G"], [], [], []]);
    expect(answersFor(FORM_B)).toEqual([["C", "F"], ["B", "D"], ["G"], ["E"], [], [], []]);
  });

  test("all the answers together are the processing order without the start", () => {
    for (const graph of testGraphs(30, 4)) {
      const steps = bfsTrace({ graph, start: "A" });
      const order = steps.flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
      const added = bfsQuestions(steps).flatMap((q) => (q.answer.kind === "sequence" ? q.answer.correct : []));
      expect(added).toEqual(order.slice(1));
    }
  });

  test("the explanation says who is already visited", () => {
    const questions = bfsQuestions(bfsTrace({ graph: graphFrom(FORM_A), start: "A" }));
    expect(text(questions[0].explain)).toBe("Do fronty jdou B, D — nenavštívení sousedé A v abecedním pořadí.");
    expect(text(questions[1].explain)).toBe("Do fronty jdou F — nenavštívení sousedé B v abecedním pořadí. A už je navštívený.");
    expect(text(questions[4].explain)).toBe("Všichni sousedé C (D, G) už jsou navštívení, fronta se nezmění.");
  });
});
