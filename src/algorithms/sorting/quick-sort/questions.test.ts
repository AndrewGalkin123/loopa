import { describe, expect, test } from "vitest";
import { randomArrays } from "@/algorithms/testUtils";
import type { NotePart } from "@/core/types";
import { quickSortQuestions } from "./questions";
import { quickSortTrace } from "./trace";

const text = (parts: NotePart[]) => parts.map((p) => (typeof p === "string" ? p : p.text)).join(" ");
const questionsOf = (input: number[]) => quickSortQuestions(quickSortTrace(input));
const pivotPlaces = (input: number[]) =>
  questionsOf(input).flatMap((q) => (q.answer.kind === "pick" ? [Number(q.answer.correct[0])] : []));
const goesLeft = (input: number[]) => questionsOf(input).flatMap((q) => (q.answer.kind === "yes-no" ? [q.answer.correct] : []));

describe("Quick Sort questions", () => {
  // q of every PARTITION call, as printed by docs/research/tools/answer_keys.py.
  test("research forms A and B: the pivot ends where the answer key says", () => {
    expect(pivotPlaces([5, 2, 8, 1, 9, 3, 7, 4])).toEqual([3, 2, 0, 4, 7, 5]);
    expect(pivotPlaces([6, 3, 9, 2, 7, 1, 8, 5])).toEqual([3, 0, 2, 4, 5, 7]);
  });

  test("yes / no questions only in the first partition, one per comparison", () => {
    // Form A: pivot 4, values 5 2 8 1 9 3 7.
    expect(goesLeft([5, 2, 8, 1, 9, 3, 7, 4])).toEqual([false, true, false, true, false, true, false]);
    for (const input of randomArrays(100)) {
      expect(goesLeft(input)).toHaveLength(input.length - 1);
    }
  });

  test("a value equal to the pivot goes left (Lomuto with ≤, as in the research)", () => {
    expect(goesLeft([4, 2, 4])).toEqual([true, true]);
  });

  test("the answer is where the pivot really lands", () => {
    for (const input of randomArrays(100)) {
      const steps = quickSortTrace(input);
      for (const q of quickSortQuestions(steps)) {
        if (q.answer.kind !== "pick") continue;
        const { range } = steps[q.at].event as { range: [number, number] };
        const pivot = steps[q.at].state.values[range[1]];
        const place = Number(q.answer.correct[0]);
        const settled = steps.slice(q.at).find((s) => s.event.type === "settle" && s.line === 14)!;
        expect(settled.state.values[place]).toBe(pivot);
      }
    }
  });

  test("the explanation counts the values that go before the pivot", () => {
    const [first] = questionsOf([5, 2, 8, 1, 9, 3, 7, 4]);
    expect(text(first.explain)).toBe("Pivot 4 skončí na [3] — v úseku jsou 3 čísla ≤ 4, ta půjdou před něj.");
    const [none] = questionsOf([5, 3, 1]);
    expect(text(none.explain)).toBe("Pivot 1 skončí na [0] — v úseku není žádné číslo ≤ 1, pivot jde na začátek úseku.");
  });
});
