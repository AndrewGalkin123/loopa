import type { Text } from "@/i18n/config";
/* Input arrays of the search model. Values are 0–99, as in the array model. */

export type SearchDataset = "random" | "uniform" | "skewed" | "shuffled" | "sorted";

/** Prepared arrays for algorithms that need sorted input. */
export const SORTED_DATASETS: { id: SearchDataset; hint: Text }[] = [
  { id: "random", hint: { cs: "náhodné hodnoty", en: "random values" } },
  { id: "uniform", hint: { cs: "rovnoměrné rozestupy", en: "even gaps" } },
  { id: "skewed", hint: { cs: "hodnoty se nakupí vlevo", en: "values crowd on the left" } },
];

/** Prepared arrays for algorithms that accept any order. */
export const ANY_ORDER_DATASETS: { id: SearchDataset; hint: Text }[] = [
  { id: "shuffled", hint: { cs: "náhodné pořadí", en: "random order" } },
  { id: "sorted", hint: { cs: "seřazené", en: "sorted" } },
];

const MAX_VALUE = 99;

/** n different values from 1–99, ascending. */
function randomSorted(n: number, random: () => number): number[] {
  const pool = Array.from({ length: MAX_VALUE }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n).sort((a, b) => a - b);
}

/** An array of n different values of the given kind. `random` can be seeded in tests. */
export function makeValues(kind: SearchDataset, n: number, random: () => number = Math.random): number[] {
  switch (kind) {
    case "uniform":
      // A straight line from 1 to 99: the ideal input of interpolation search.
      return Array.from({ length: n }, (_, i) => 1 + Math.round((i * (MAX_VALUE - 1)) / (n - 1)));
    case "skewed":
      // Small differences on the left, a big jump on the right: a bad input for interpolation.
      return Array.from({ length: n }, (_, i) => i + Math.round((MAX_VALUE - (n - 1)) * (i / (n - 1)) ** 6));
    case "shuffled": {
      const values = randomSorted(n, random);
      for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
      }
      return values;
    }
    case "random":
    case "sorted":
      return randomSorted(n, random);
  }
}

/** A value from the array. */
export function targetInside(values: number[], random: () => number = Math.random): number {
  return values[Math.floor(random() * values.length)];
}

/** A value from 0–99 that is not in the array (there is always one: at most 40 values). */
export function targetOutside(values: number[], random: () => number = Math.random): number {
  const free = Array.from({ length: MAX_VALUE + 1 }, (_, i) => i).filter((v) => !values.includes(v));
  return free[Math.floor(random() * free.length)];
}
