import type { Task, TaskCheck } from "@/core/types";
import type { ArrayEvent, ArrayState } from "./types";

/** A task of an algorithm on an array. */
export type ArrayTask = Task<number[], ArrayState, ArrayEvent>;

/** A task about an array of one length: until the array has it, the task asks for it. */
export function ofLength(values: number[], length: number, check: () => TaskCheck): TaskCheck {
  if (values.length !== length) return { done: false, status: `nastav velikost pole na ${length}` };
  return check();
}
