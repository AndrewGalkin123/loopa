import { mulberry32 } from "@/lib/random";
import { MAX_RANDOM_NODES, maxRandomEdges, MIN_RANDOM_NODES, PRESETS, randomGraph } from "@/models/graph/presets";
import type { Graph } from "@/models/graph/types";
import { makeValues, targetInside, targetOutside, type SearchDataset } from "@/models/search/datasets";
import type { SearchInput } from "@/models/search/types";

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

/** A graph from a list of edges (positions do not matter for the algorithms). */
export function graphFrom(edges: [string, string][]): Graph {
  const ids = [...new Set(edges.flat())].sort();
  return { nodes: ids.map((id) => ({ id, x: 0, y: 0 })), edges };
}

/** The prepared graphs plus `count` random ones of random sizes, always the same for the same seed. */
export function testGraphs(count: number, seed = 1): Graph[] {
  const random = mulberry32(seed);
  const randomOne = () => {
    const n = MIN_RANDOM_NODES + Math.floor(random() * (MAX_RANDOM_NODES - MIN_RANDOM_NODES + 1));
    const m = n - 1 + Math.floor(random() * (maxRandomEdges(n) - n + 2));
    return randomGraph(n, m, random);
  };
  return [...PRESETS.map((p) => p.graph), ...Array.from({ length: count }, randomOne)];
}

/** `count` search inputs of random sizes; the target is in the array about half of the time. */
export function testSearchInputs(count: number, sorted: boolean, seed = 1): SearchInput[] {
  const random = mulberry32(seed);
  const kinds: SearchDataset[] = sorted ? ["random", "uniform", "skewed"] : ["shuffled", "sorted"];
  return Array.from({ length: count }, (_, k) => {
    const n = 2 + Math.floor(random() * 39);
    const values = makeValues(kinds[k % kinds.length], n, random);
    return { values, target: random() < 0.5 ? targetInside(values, random) : targetOutside(values, random) };
  });
}
