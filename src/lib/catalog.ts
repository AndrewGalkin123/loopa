import {
  ArrowUpNarrowWide,
  GitBranch,
  GitFork,
  Layers,
  ListOrdered,
  Route,
  Search,
  TrendingDown,
  Zap,
} from "lucide-react";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/* Cards of the algorithm catalog (texts from design/Algorithms.html).
   The landing page has its own, slightly different texts. */

export const BUBBLE_SORT: AlgorithmCardData = {
  num: "01",
  group: "sorting",
  badge: { variant: "sorting", icon: ArrowUpNarrowWide, label: "sort" },
  title: "Bubble Sort",
  tagline: "simple",
  description: "Jednoduchý algoritmus třídění. Porovnává a\u00a0vyměňuje sousední prvky, dokud není pole seřazené.",
  complexity: "O(n²)",
  level: "beginner",
  href: "/algorithms/bubble-sort",
};

export const QUICK_SORT: AlgorithmCardData = {
  num: "02",
  group: "sorting",
  badge: { variant: "sorting", icon: Zap, label: "fast" },
  title: "Quick Sort",
  tagline: "divide",
  description: "Rozděl a\u00a0panuj. Volí pivot a\u00a0rekurzivně třídí dvě poloviny pole.",
  complexity: "O(n log n)",
  level: "intermediate",
  href: "/algorithms/quick-sort",
};

export const MERGE_SORT: AlgorithmCardData = {
  num: "03",
  group: "sorting",
  badge: { variant: "sorting", icon: Layers, label: "stable" },
  title: "Merge Sort",
  tagline: "stable",
  description: "Stabilní třídění shora dolů. Rozdělí pole, seřadí poloviny a\u00a0poté je sloučí.",
  complexity: "O(n log n)",
  level: "intermediate",
};

export const CATALOG: AlgorithmCardData[] = [
  BUBBLE_SORT,
  QUICK_SORT,
  MERGE_SORT,
  {
    num: "04",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    title: "Binary Search",
    tagline: "halve",
    description: "Vyhledávání v\u00a0seřazeném poli. V\u00a0každém kroku zahodí polovinu prostoru.",
    complexity: "O(log n)",
    level: "beginner",
  },
  {
    num: "05",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: ListOrdered, label: "lin" },
    title: "Linear Search",
    tagline: "scan",
    description: "Sekvenční průchod polem. Nejjednodušší vyhledávání bez požadavku na\u00a0uspořádání.",
    complexity: "O(n)",
    level: "beginner",
  },
  {
    num: "06",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitBranch, label: "bfs" },
    title: "BFS",
    tagline: "ripples",
    description: "Procházení grafu po\u00a0vrstvách. Najde nejkratší cestu v\u00a0neváženém grafu.",
    complexity: "O(V + E)",
    level: "intermediate",
  },
  {
    num: "07",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitFork, label: "dfs" },
    title: "DFS",
    tagline: "deepen",
    description: "Procházení grafu do\u00a0hloubky. Základ pro topologické řazení i\u00a0hledání cyklů.",
    complexity: "O(V + E)",
    level: "intermediate",
  },
  {
    num: "08",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Route, label: "path" },
    title: "Dijkstra",
    tagline: "greedy",
    description: "Nejkratší cesty z\u00a0jednoho zdroje ve\u00a0váženém grafu s\u00a0nezápornými hranami.",
    complexity: "O(E log V)",
    level: "advanced",
  },
  {
    num: "09",
    group: "optimization",
    badge: { variant: "optimization", icon: TrendingDown, label: "opt" },
    title: "Gradient Descent",
    tagline: "iterate",
    description: "Iterativní optimalizace. Sestupuje po\u00a0gradientu k\u00a0lokálnímu minimu funkce.",
    complexity: "iterative",
    level: "advanced",
  },
];
