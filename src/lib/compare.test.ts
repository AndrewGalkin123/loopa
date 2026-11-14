import { describe, expect, test } from "vitest";
import { ALGORITHMS } from "@/algorithms/registry";
import { ascending, randomArrays, sortedCopy } from "@/algorithms/testUtils";
import { buildTimeline, COMPARABLE, operations, resolveSlots } from "./compare";

const pairs = COMPARABLE.flatMap((a) => COMPARABLE.filter((b) => b !== a).map((b) => [a, b] as const));
const inputs = [...randomArrays(60), ascending(12), ascending(12).reverse(), [2, 1], [5, 5, 5]];
const pairName = ([a, b]: readonly [{ slug: string }, { slug: string }]) => `${a.slug} × ${b.slug}`;

describe("compare timeline", () => {
  test("offers all the sorting algorithms and only them", () => {
    // Taken from the registry, so a new sorting algorithm does not need a change here.
    const sorting = ALGORITHMS.filter((d) => d.group === "sorting").map((d) => d.slug);
    expect(COMPARABLE.map((d) => d.slug)).toEqual(sorting);
    expect(sorting).toContain("bubble-sort");
  });

  test.each(pairs.map((pair) => [pairName(pair), pair] as const))("%s: one frame per operation of the slower one", (_, [a, b]) => {
    for (const input of inputs) {
      const stepsA = a.trace(input);
      const stepsB = b.trace(input);
      const timeline = buildTimeline(stepsA, stepsB);
      const totalA = operations(stepsA.at(-1)!);
      const totalB = operations(stepsB.at(-1)!);
      expect(timeline).toHaveLength(Math.max(totalA, totalB) + 1);

      timeline.forEach(({ state }, clock) => {
        // Nobody is ever ahead of the clock.
        expect(state.opsA).toBeLessThanOrEqual(clock);
        expect(state.opsB).toBeLessThanOrEqual(clock);
        // A finished side stays on its last step.
        if (clock >= totalA) expect(state.a).toBe(stepsA.at(-1));
        if (clock >= totalB) expect(state.b).toBe(stepsB.at(-1));
        if (clock > 0) {
          expect(state.opsA).toBeGreaterThanOrEqual(timeline[clock - 1].state.opsA);
          expect(state.opsB).toBeGreaterThanOrEqual(timeline[clock - 1].state.opsB);
        }
      });

      const last = timeline.at(-1)!.state;
      expect(last.a.state.values).toEqual(sortedCopy(input));
      expect(last.b.state.values).toEqual(sortedCopy(input));
    }
  });

  test.each(pairs.map((pair) => [pairName(pair), pair] as const))("%s: a running side shows only steps that cost something", (_, [a, b]) => {
    const input = [5, 3, 8, 1, 9, 2, 7];
    const stepsA = a.trace(input);
    const stepsB = b.trace(input);
    const costs = (steps: typeof stepsA, step: (typeof stepsA)[number]) =>
      operations(step) > operations(steps[steps.indexOf(step) - 1]);

    buildTimeline(stepsA, stepsB).slice(1).forEach(({ state }, i) => {
      const clock = i + 1;
      if (clock < operations(stepsA.at(-1)!)) expect(costs(stepsA, state.a)).toBe(true);
      if (clock < operations(stepsB.at(-1)!)) expect(costs(stepsB, state.b)).toBe(true);
    });
  });

  test("the clock reflects the data: on sorted input Bubble Sort beats Quick Sort", () => {
    const [bubble, quick] = resolveSlots("bubble-sort", "quick-sort");
    const input = ascending(15);
    expect(operations(bubble.trace(input).at(-1)!)).toBe(14);
    expect(operations(quick.trace(input).at(-1)!)).toBe(105);
  });
});

describe("slots from the address", () => {
  test("two valid algorithms are kept", () => {
    expect(resolveSlots("merge-sort", "bubble-sort").map((d) => d.slug)).toEqual(["merge-sort", "bubble-sort"]);
  });

  test("defaults, an unknown algorithm and a non-sorting one", () => {
    expect(resolveSlots(undefined, undefined).map((d) => d.slug)).toEqual(["bubble-sort", "quick-sort"]);
    expect(resolveSlots("nonsense", "merge-sort").map((d) => d.slug)).toEqual(["bubble-sort", "merge-sort"]);
    expect(resolveSlots("bfs", "dijkstra").map((d) => d.slug)).toEqual(["bubble-sort", "quick-sort"]);
  });

  test("only the first one given: the second is Quick Sort, or Bubble Sort next to Quick Sort", () => {
    expect(resolveSlots("insertion-sort", undefined).map((d) => d.slug)).toEqual(["insertion-sort", "quick-sort"]);
    expect(resolveSlots("quick-sort", undefined).map((d) => d.slug)).toEqual(["quick-sort", "bubble-sort"]);
  });

  test("the same algorithm twice is replaced", () => {
    expect(resolveSlots("quick-sort", "quick-sort").map((d) => d.slug)).toEqual(["quick-sort", "bubble-sort"]);
  });
});
