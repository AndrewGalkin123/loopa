/* Input arrays for the player: generated ones and the user's own. */

/** Kinds of generated arrays (the "array" button of the player). */
export type DatasetKind = "random" | "nearly" | "sorted" | "reversed";

/**
 * Datasets offered on the "array" button. The hints are neutral; an algorithm can
 * replace them with what the input means for it (AlgorithmDefinition.inputHints).
 */
export const DATASETS: { id: DatasetKind; label: string; hint: string }[] = [
  { id: "random", label: "random", hint: "náhodné pořadí" },
  { id: "nearly", label: "nearly sorted", hint: "téměř seřazené" },
  { id: "sorted", label: "sorted", hint: "seřazené" },
  { id: "reversed", label: "reversed", hint: "obrácené pořadí" },
];

/** Limits of the array size (slider and own input). */
export const MIN_SIZE = 2;
export const MAX_SIZE = 40;
export const MAX_VALUE = 99;

/** Numbers 1..n arranged according to the dataset. Uses Math.random — call it only in event handlers. */
export function makeArray(dataset: DatasetKind, n: number): number[] {
  const values = Array.from({ length: n }, (_, i) => i + 1);
  switch (dataset) {
    case "sorted":
      return values;
    case "reversed":
      return values.reverse();
    case "nearly": {
      // A sorted array with a few neighbours swapped.
      for (let k = 0; k < Math.max(1, Math.round(n / 6)); k++) {
        const i = Math.floor(Math.random() * (n - 1));
        [values[i], values[i + 1]] = [values[i + 1], values[i]];
      }
      return values;
    }
    case "random":
      return shuffle(values);
  }
}

function shuffle(values: number[]): number[] {
  const a = [...values];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** [3, 1, 4] → "[3, 1, 4]" */
export function formatArray(values: number[]): string {
  return `[${values.join(", ")}]`;
}

/** Reads the user's own input, e.g. "[3, 1, 4]" or "3 1 4". Returns the numbers or an error message. */
export function parseArray(text: string): { values: number[] } | { error: string } {
  const parts = text
    .replace(/[[\]]/g, " ")
    .split(/[\s,;]+/)
    .filter(Boolean);
  if (parts.length < MIN_SIZE || parts.length > MAX_SIZE) {
    return { error: `Zadej ${MIN_SIZE}–${MAX_SIZE} čísel oddělených čárkou.` };
  }
  const values = parts.map(Number);
  if (values.some((v) => !Number.isInteger(v) || v < 0 || v > MAX_VALUE)) {
    return { error: `Povolená jsou jen celá čísla 0–${MAX_VALUE}.` };
  }
  return { values };
}
