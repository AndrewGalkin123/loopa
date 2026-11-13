import { describe, expect, test } from "vitest";
import { randomArrays } from "@/algorithms/testUtils";
import type { NotePart } from "@/core/types";
import { insertionSortQuestions } from "./questions";
import { insertionSortTrace } from "./trace";

const text = (parts: NotePart[]) => parts.map((p) => (typeof p === "string" ? p : p.text)).join(" ");
const answers = (input: number[]) =>
  insertionSortQuestions(insertionSortTrace(input)).map((q) => (q.answer.kind === "pick" ? Number(q.answer.correct[0]) : -1));

describe("Insertion Sort questions", () => {
  test("one question per pass, asked at the step that takes the key", () => {
    const steps = insertionSortTrace([5, 1, 4, 2]);
    const questions = insertionSortQuestions(steps);
    expect(questions).toHaveLength(3);
    for (const q of questions) expect(steps[q.at].line).toBe(3);
  });

  // The key positions of the research forms, as printed by docs/research/tools/answer_keys.py.
  test("research forms A and B: the key goes where the answer key says", () => {
    expect(answers([7, 3, 5, 1, 6, 2])).toEqual([0, 1, 0, 3, 1]);
    expect(answers([8, 2, 6, 4, 9, 1])).toEqual([0, 1, 1, 4, 0]);
  });

  test("the answer is where the key really ends up", () => {
    for (const input of randomArrays(100)) {
      const steps = insertionSortTrace(input);
      for (const q of insertionSortQuestions(steps)) {
        const key = steps[q.at].state.values[(steps[q.at].event as { range: [number, number] }).range[1]];
        const placed = steps.slice(q.at).find((s) => s.line === 8)!;
        expect(placed.state.values[Number((q.answer as { correct: string[] }).correct[0])]).toBe(key);
      }
    }
  });

  test("the explanation names what is shifted", () => {
    const [first, second] = insertionSortQuestions(insertionSortTrace([7, 3, 5]));
    expect(text(first.explain)).toBe("Klíč 3 skončí na [0] — 7 je větší a posune se doprava, klíč je nejmenší a jde na začátek.");
    expect(text(second.explain)).toBe("Klíč 5 skončí na [1] — 7 je větší a posune se doprava, 3 ≤ 5 zůstane.");
    const [stays] = insertionSortQuestions(insertionSortTrace([1, 2]));
    expect(text(stays.explain)).toBe("Klíč 2 zůstane na [1] — 1 není větší, nic se neposune.");
  });
});
