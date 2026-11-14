import { expect, test } from "vitest";
import { quickSortKeyStates } from "./keyStates";
import { quickSortTrace } from "./trace";

const afterPartitions = (input: number[]) => {
  const steps = quickSortTrace(input);
  // Without the first picture (the input) and the last one (sorted).
  return quickSortKeyStates(steps)
    .slice(1, -1)
    .map((k) => steps[k.step].state.values);
};

// The array after every PARTITION call, as printed by docs/research/tools/answer_keys.py.
test("research forms A and B: the array after every partition", () => {
  expect(afterPartitions([5, 2, 8, 1, 9, 3, 7, 4])).toEqual([
    [2, 1, 3, 4, 9, 8, 7, 5],
    [2, 1, 3, 4, 9, 8, 7, 5],
    [1, 2, 3, 4, 9, 8, 7, 5],
    [1, 2, 3, 4, 5, 8, 7, 9],
    [1, 2, 3, 4, 5, 8, 7, 9],
    [1, 2, 3, 4, 5, 7, 8, 9],
  ]);
  expect(afterPartitions([6, 3, 9, 2, 7, 1, 8, 5])).toEqual([
    [3, 2, 1, 5, 7, 9, 8, 6],
    [1, 2, 3, 5, 7, 9, 8, 6],
    [1, 2, 3, 5, 7, 9, 8, 6],
    [1, 2, 3, 5, 6, 9, 8, 7],
    [1, 2, 3, 5, 6, 7, 8, 9],
    [1, 2, 3, 5, 6, 7, 8, 9],
  ]);
});
