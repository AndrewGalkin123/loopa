import { mulberry32 } from "@/lib/random";

/*
 * Helpers for the algorithm tests. The "random" arrays come from a seeded
 * generator, so a failing test fails the same way every time.
 */

/** `count` arrays of 2–40 values 0–99 (duplicates included), always the same for the same seed. */
export function randomArrays(count: number, seed = 1): number[][] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const n = 2 + Math.floor(random() * 39);
    return Array.from({ length: n }, () => Math.floor(random() * 100));
  });
}

export function sortedCopy(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

/** Number of pairs i < j with values[i] > values[j]. */
export function inversions(values: number[]): number {
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) if (values[i] > values[j]) count++;
  }
  return count;
}

/** 1..n */
export function ascending(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1);
}
