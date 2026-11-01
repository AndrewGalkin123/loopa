import { bfs } from "./graphs/bfs/definition";
import { dfs } from "./graphs/dfs/definition";
import { binarySearch } from "./search/binary-search/definition";
import { interpolationSearch } from "./search/interpolation-search/definition";
import { linearSearch } from "./search/linear-search/definition";
import { bubbleSort } from "./sorting/bubble-sort/definition";
import { mergeSort } from "./sorting/merge-sort/definition";
import { quickSort } from "./sorting/quick-sort/definition";

/*
 * All algorithms that have their own page — the single list the whole site
 * reads (pages, player, catalog). Adding an algorithm:
 *   1. a folder in src/algorithms/<category>/<slug>/ with definition.ts,
 *      trace.ts, code.tsx, content.tsx (and trace.test.ts);
 *   2. one line here and one in content.ts (TypeScript reports it if missing).
 */
export const ALGORITHMS = [bubbleSort, quickSort, mergeSort, binarySearch, linearSearch, interpolationSearch, bfs, dfs];

/** "bubble-sort" | "quick-sort" | … — derived from the list above. */
export type Slug = (typeof ALGORITHMS)[number]["slug"];

export function findAlgorithm(slug: string) {
  return ALGORITHMS.find((algorithm) => algorithm.slug === slug);
}
