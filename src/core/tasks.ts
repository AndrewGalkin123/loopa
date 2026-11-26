import { LOCALES, pick, tx, type Localized, type Locale, type Text } from "@/i18n/config";
import type { TaskCheck } from "./types";

/* Helpers for the tasks "find an input such that …" (Task in types.ts). */

const GOAL: Localized = { cs: "cíl", en: "goal" };
const AT_LEAST: Localized = { cs: "aspoň", en: "at least" };

/** A status in every language, made from the parts of the current one. */
function inEvery(make: (locale: Locale) => string): Localized {
  return Object.fromEntries(LOCALES.map((locale) => [locale, make(locale)])) as Localized;
}

/** A counter that has to reach a value: "výměny: 12 · cíl 28". */
export function reach(label: Text, value: number, goal: number): TaskCheck {
  return { done: value === goal, status: inEvery((l) => `${tx(label, l)}: ${value} · ${pick(GOAL, l)} ${goal}`) };
}

/** A counter that has to get at least to a value: "průchody: 2 · cíl aspoň 3". */
export function atLeast(label: Text, value: number, goal: number): TaskCheck {
  return {
    done: value >= goal,
    status: inEvery((l) => `${tx(label, l)}: ${value} · ${pick(GOAL, l)} ${pick(AT_LEAST, l)} ${goal}`),
  };
}

/** A task that cannot be solved: it only shows the counter the student is trying to change. */
export function unreachable(label: Text, value: number): TaskCheck {
  return { done: false, status: inEvery((l) => `${tx(label, l)}: ${value}`) };
}
