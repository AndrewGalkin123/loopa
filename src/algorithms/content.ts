import type { Slug } from "./registry";
import { bubbleSortContent } from "./sorting/bubble-sort/content";
import { mergeSortContent } from "./sorting/merge-sort/content";
import { quickSortContent } from "./sorting/quick-sort/content";
import type { AlgorithmContent } from "./types";

/*
 * Long texts of the algorithm pages, by slug. Kept apart from registry.ts because
 * they are needed only on the server, while the registry is also loaded in the
 * browser (the player). Record<Slug, …> makes TypeScript complain when an
 * algorithm from the registry has no texts here.
 */
export const CONTENT: Record<Slug, AlgorithmContent> = {
  "bubble-sort": bubbleSortContent,
  "quick-sort": quickSortContent,
  "merge-sort": mergeSortContent,
};
