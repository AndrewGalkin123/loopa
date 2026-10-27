import { GitBranch, GitFork, ListOrdered, Route, Search, TrendingDown } from "lucide-react";
import { ALGORITHMS } from "@/algorithms/registry";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";
import type { AlgorithmDefinition } from "@/core/types";

/*
 * Cards of the algorithm catalog (texts from design/Algorithms.html).
 * Cards of algorithms that have a page are built from their definition.ts;
 * the rest are planned ones without a page yet.
 * The landing page has its own, slightly different texts.
 */

export type CatalogCard = AlgorithmCardData & { slug: string };

/** Algorithms planned for the catalog that do not have a page yet. */
const PLANNED: Omit<CatalogCard, "num">[] = [
  {
    slug: "binary-search",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    title: "Binary Search",
    tagline: "halve",
    description: "Vyhledávání v\u00a0seřazeném poli. V\u00a0každém kroku zahodí polovinu prostoru.",
    complexity: "O(log n)",
    level: "beginner",
  },
  {
    slug: "linear-search",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: ListOrdered, label: "lin" },
    title: "Linear Search",
    tagline: "scan",
    description: "Sekvenční průchod polem. Nejjednodušší vyhledávání bez požadavku na\u00a0uspořádání.",
    complexity: "O(n)",
    level: "beginner",
  },
  {
    slug: "bfs",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitBranch, label: "bfs" },
    title: "BFS",
    tagline: "ripples",
    description: "Procházení grafu po\u00a0vrstvách. Najde nejkratší cestu v\u00a0neváženém grafu.",
    complexity: "O(V + E)",
    level: "intermediate",
  },
  {
    slug: "dfs",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitFork, label: "dfs" },
    title: "DFS",
    tagline: "deepen",
    description: "Procházení grafu do\u00a0hloubky. Základ pro topologické řazení i\u00a0hledání cyklů.",
    complexity: "O(V + E)",
    level: "intermediate",
  },
  {
    slug: "dijkstra",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Route, label: "path" },
    title: "Dijkstra",
    tagline: "greedy",
    description: "Nejkratší cesty z\u00a0jednoho zdroje ve\u00a0váženém grafu s\u00a0nezápornými hranami.",
    complexity: "O(E log V)",
    level: "advanced",
  },
  {
    slug: "gradient-descent",
    group: "optimization",
    badge: { variant: "optimization", icon: TrendingDown, label: "opt" },
    title: "Gradient Descent",
    tagline: "iterate",
    description: "Iterativní optimalizace. Sestupuje po\u00a0gradientu k\u00a0lokálnímu minimu funkce.",
    complexity: "iterative",
    level: "advanced",
  },
];

/** Order of the catalog (it gives the card numbers 01, 02, …). */
const ORDER = [
  "bubble-sort",
  "quick-sort",
  "merge-sort",
  "binary-search",
  "linear-search",
  "bfs",
  "dfs",
  "dijkstra",
  "gradient-descent",
];

function cardOf(definition: AlgorithmDefinition): Omit<CatalogCard, "num"> {
  return {
    slug: definition.slug,
    group: definition.group,
    badge: definition.card.badge,
    title: definition.name,
    tagline: definition.card.tagline,
    description: definition.card.description,
    complexity: definition.complexity,
    level: definition.level,
    href: `/algorithms/${definition.slug}`,
  };
}

const CARDS = [...ALGORITHMS.map(cardOf), ...PLANNED];

export const CATALOG: CatalogCard[] = ORDER.map((slug, i) => {
  const card = CARDS.find((c) => c.slug === slug);
  if (!card) throw new Error(`Catalog: unknown algorithm "${slug}"`);
  return { ...card, num: String(i + 1).padStart(2, "0") };
});

/** The catalog card of an algorithm (used for the "related" cards on algorithm pages). */
export function catalogCard(slug: string): CatalogCard {
  const card = CATALOG.find((c) => c.slug === slug);
  if (!card) throw new Error(`Catalog: unknown algorithm "${slug}"`);
  return card;
}
