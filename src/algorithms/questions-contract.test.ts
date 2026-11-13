import { describe, expect, test } from "vitest";
import { ALGORITHMS } from "@/algorithms/registry";
import { randomArrays, testGraphs, testWeightedGraphs } from "@/algorithms/testUtils";
import type { Step } from "@/core/types";
import type { ArrayState } from "@/models/array/types";
import type { GraphState } from "@/models/graph/types";

/*
 * Rules every question of the mode Předpověz must follow. A new algorithm with
 * questions is checked by these tests automatically, as soon as it is in the registry.
 */
const withQuestions = ALGORITHMS.filter((definition) => definition.questions);

/** Inputs of the algorithm's model and the ids its picture can be clicked by. */
function runs(definition: (typeof withQuestions)[number]) {
  if (definition.model === "array") {
    return randomArrays(60, 11).map((input) => ({ steps: definition.trace(input as never) as Step[], ids: input.map((_, i) => String(i)) }));
  }
  const graphs = "weighted" in definition && definition.weighted ? testWeightedGraphs(definition.weighted, 30, 12) : testGraphs(30, 12);
  return graphs.map((graph) => ({ steps: definition.trace({ graph, start: "A" } as never) as Step[], ids: graph.nodes.map((n) => n.id) }));
}

test("the four algorithms of the research have questions", () => {
  expect(withQuestions.map((d) => d.slug).sort()).toEqual(["bfs", "dijkstra", "insertion-sort", "quick-sort"]);
});

describe.each(withQuestions)("$slug: questions follow the rules", (definition) => {
  test("asked before the end, in the order of the run, with a text and an explanation", () => {
    for (const { steps } of runs(definition)) {
      const questions = definition.questions!(steps as never);
      questions.forEach((q, i) => {
        expect(q.at).toBeGreaterThanOrEqual(0);
        expect(q.at).toBeLessThan(steps.length - 1);
        if (i > 0) expect(q.at).toBeGreaterThanOrEqual(questions[i - 1].at);
        expect(q.prompt.length).toBeGreaterThan(0);
        expect(q.explain.length).toBeGreaterThan(0);
      });
    }
  });

  test("a click answer names things the picture shows; a pick has at least one right answer", () => {
    for (const { steps, ids } of runs(definition)) {
      for (const q of definition.questions!(steps as never)) {
        if (q.answer.kind === "yes-no") continue;
        for (const id of q.answer.correct) expect(ids).toContain(id);
        if (q.answer.kind === "pick") expect(q.answer.correct.length).toBeGreaterThan(0);
      }
    }
  });

  test("the picture of the question step does not show the answer yet", () => {
    for (const { steps } of runs(definition)) {
      for (const q of definition.questions!(steps as never)) {
        if (q.answer.kind !== "pick") continue;
        const state = steps[q.at].state as Partial<ArrayState & GraphState>;
        // Arrays: the answer is not marked as already sorted; graphs: the vertex is not closed yet.
        for (const id of q.answer.correct) {
          const mark = definition.model === "array" ? state.marks?.[Number(id)] : state.marks?.[id];
          expect(mark).not.toBe(definition.model === "array" ? "sorted" : "done");
        }
      }
    }
  });
});
