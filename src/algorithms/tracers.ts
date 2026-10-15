import { bubbleSortTracer } from "./bubble-sort/trace";
import { mergeSortTracer } from "./merge-sort/trace";
import { quickSortTracer } from "./quick-sort/trace";
import type { AlgorithmTracer } from "./types";

/*
 * Step generators by slug. Kept apart from the page texts (index.ts) because
 * the player runs in the browser and functions cannot be passed from the
 * server to client components — the player gets only the slug and looks it up here.
 */
export const TRACERS: Record<string, AlgorithmTracer> = {
  "bubble-sort": bubbleSortTracer,
  "quick-sort": quickSortTracer,
  "merge-sort": mergeSortTracer,
};
