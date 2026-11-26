import type { Localized } from "@/i18n/config";
import { bfsContent } from "./graphs/bfs/content.cs";
import { dfsContent } from "./graphs/dfs/content.cs";
import type { Slug } from "./registry";
import { binarySearchContent } from "./search/binary-search/content.cs";
import { interpolationSearchContent } from "./search/interpolation-search/content.cs";
import { linearSearchContent } from "./search/linear-search/content.cs";
import { bellmanFordContent } from "./shortest-paths/bellman-ford/content.cs";
import { dijkstraContent } from "./shortest-paths/dijkstra/content.cs";
import { levitContent } from "./shortest-paths/levit/content.cs";
import { bubbleSortContent } from "./sorting/bubble-sort/content.cs";
import { bubbleSortContentEn } from "./sorting/bubble-sort/content.en";
import { heapSortContent } from "./sorting/heap-sort/content.cs";
import { insertionSortContent } from "./sorting/insertion-sort/content.cs";
import { mergeSortContent } from "./sorting/merge-sort/content.cs";
import { quickSortContent } from "./sorting/quick-sort/content.cs";
import { selectionSortContent } from "./sorting/selection-sort/content.cs";
import type { AlgorithmContent } from "./types";

/*
 * Long texts of the algorithm pages, by slug and language (content.<language>.tsx
 * in the folder of the algorithm; Czech always, the others once translated).
 * Kept apart from registry.ts because they are needed only on the server, while
 * the registry is also loaded in the
 * browser (the player). Record<Slug, …> makes TypeScript complain when an
 * algorithm from the registry has no texts here.
 */
export const CONTENT: Record<Slug, Localized<AlgorithmContent>> = {
  "bubble-sort": { cs: bubbleSortContent, en: bubbleSortContentEn },
  "selection-sort": { cs: selectionSortContent },
  "insertion-sort": { cs: insertionSortContent },
  "quick-sort": { cs: quickSortContent },
  "merge-sort": { cs: mergeSortContent },
  "heap-sort": { cs: heapSortContent },
  "binary-search": { cs: binarySearchContent },
  "linear-search": { cs: linearSearchContent },
  "interpolation-search": { cs: interpolationSearchContent },
  bfs: { cs: bfsContent },
  dfs: { cs: dfsContent },
  dijkstra: { cs: dijkstraContent },
  "bellman-ford": { cs: bellmanFordContent },
  levit: { cs: levitContent },
};
