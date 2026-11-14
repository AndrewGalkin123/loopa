import { expect, test } from "vitest";
import { insertionSortKeyStates } from "./keyStates";
import { insertionSortTrace } from "./trace";

const pictures = (input: number[]) => {
  const steps = insertionSortTrace(input);
  return insertionSortKeyStates(steps).map((k) => steps[k.step].state.values);
};

// The arrays after each pass, as printed by docs/research/tools/answer_keys.py.
test("research forms A and B: the input, then the array after every pass", () => {
  expect(pictures([7, 3, 5, 1, 6, 2])).toEqual([
    [7, 3, 5, 1, 6, 2],
    [3, 7, 5, 1, 6, 2],
    [3, 5, 7, 1, 6, 2],
    [1, 3, 5, 7, 6, 2],
    [1, 3, 5, 6, 7, 2],
    [1, 2, 3, 5, 6, 7],
  ]);
  expect(pictures([8, 2, 6, 4, 9, 1]).slice(1)).toEqual([
    [2, 8, 6, 4, 9, 1],
    [2, 6, 8, 4, 9, 1],
    [2, 4, 6, 8, 9, 1],
    [2, 4, 6, 8, 9, 1],
    [1, 2, 4, 6, 8, 9],
  ]);
});
