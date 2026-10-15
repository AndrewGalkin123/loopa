import { bubbleSort } from "./bubble-sort/content";
import { quickSort } from "./quick-sort/content";
import type { AlgorithmContent } from "./types";

/*
 * All algorithm pages. Adding an algorithm = a new folder next to bubble-sort/
 * (content.tsx, code.tsx, trace.ts) + one line here and one in tracers.ts.
 */
export const ALGORITHMS: AlgorithmContent[] = [bubbleSort, quickSort];

export function getAlgorithm(slug: string): AlgorithmContent | undefined {
  return ALGORITHMS.find((algorithm) => algorithm.slug === slug);
}
