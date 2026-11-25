import type { TaskCheck } from "./types";

/* Helpers for the tasks "find an input such that …" (Task in types.ts). */

/** A counter that has to reach a value: "výměny: 12 · cíl 28". */
export function reach(label: string, value: number, goal: number): TaskCheck {
  return { done: value === goal, status: `${label}: ${value} · cíl ${goal}` };
}

/** A counter that has to get at least to a value: "průchody: 2 · cíl aspoň 3". */
export function atLeast(label: string, value: number, goal: number): TaskCheck {
  return { done: value >= goal, status: `${label}: ${value} · cíl aspoň ${goal}` };
}

/** A task that cannot be solved: it only shows the counter the student is trying to change. */
export function unreachable(label: string, value: number): TaskCheck {
  return { done: false, status: `${label}: ${value}` };
}
