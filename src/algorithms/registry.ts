import { bfs } from "./graphs/bfs/definition";
import { dfs } from "./graphs/dfs/definition";
import { binarySearch } from "./search/binary-search/definition";
import { interpolationSearch } from "./search/interpolation-search/definition";
import { linearSearch } from "./search/linear-search/definition";
import { bellmanFord } from "./shortest-paths/bellman-ford/definition";
import { dijkstra } from "./shortest-paths/dijkstra/definition";
import { levit } from "./shortest-paths/levit/definition";
import { bubbleSort } from "./sorting/bubble-sort/definition";
import { heapSort } from "./sorting/heap-sort/definition";
import { insertionSort } from "./sorting/insertion-sort/definition";
import { mergeSort } from "./sorting/merge-sort/definition";
import { quickSort } from "./sorting/quick-sort/definition";
import { selectionSort } from "./sorting/selection-sort/definition";

/*
 * All algorithms that have their own page — the single list the whole site
 * reads (pages, player, catalog, compare). Adding an algorithm:
 *   1. a folder in src/algorithms/<category>/<slug>/ with definition.ts,
 *      trace.ts, code.ts(x), content.tsx (and trace.test.ts);
 *   2. one line here and one in content.ts (TypeScript reports it if missing);
 *      the place in this list is the place in the catalog;
 *   3. if it was a planned card, remove it from planned.ts.
 * Nothing outside src/algorithms changes (thesis, VO1: the claim T1).
 */
export const ALGORITHMS = [bubbleSort, selectionSort, insertionSort, quickSort, mergeSort, heapSort, binarySearch, linearSearch, interpolationSearch, bfs, dfs, dijkstra, bellmanFord, levit];

/** "bubble-sort" | "quick-sort" | … — derived from the list above. */
export type Slug = (typeof ALGORITHMS)[number]["slug"];

export function findAlgorithm(slug: string) {
  return ALGORITHMS.find((algorithm) => algorithm.slug === slug);
}
