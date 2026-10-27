import type { AlgorithmDefinition, Step } from "@/core/types";

/* The "array" data model: a row of numbers drawn as bars (sorting, searching in arrays). */

/** How a bar is coloured. Bars without a mark are grey. */
export type ArrayMark = "compared" | "active" | "pivot" | "sorted" | "dimmed";

/** Snapshot of the array after one step. */
export interface ArrayState {
  values: number[];
  /** Mark of each highlighted index; indices that are not listed have no mark. */
  marks: Partial<Record<number, ArrayMark>>;
}

/** What happened in one step, machine-readable. */
export type ArrayEvent =
  | { type: "start" }
  | { type: "done" }
  /** A new phase of the algorithm: "pass" (Bubble), "partition" (Quick), "split" / "merge" (Merge)… */
  | { type: "phase"; name: string; range?: [number, number] }
  | { type: "compare"; i: number; j: number }
  | { type: "swap"; i: number; j: number }
  /** Values were written to these positions (algorithms that write instead of swapping). */
  | { type: "write"; at: number[] }
  /** The element at `at` reached its final place. */
  | { type: "settle"; at: number };

export type ArrayStep = Step<ArrayState, ArrayEvent>;

/** An algorithm on an array: its input is number[] and its steps are ArraySteps. */
export type ArrayAlgorithm<Slug extends string = string> = AlgorithmDefinition<number[], ArrayState, ArrayEvent> & {
  slug: Slug;
  model: "array";
};

/**
 * Declares an algorithm that works on an array. Keeps the slug as a literal type
 * ("bubble-sort", not just string), so TypeScript can check the list of page texts.
 */
export function defineArrayAlgorithm<const Slug extends string>(
  definition: Omit<ArrayAlgorithm<Slug>, "model">,
): ArrayAlgorithm<Slug> {
  return { ...definition, model: "array" };
}
