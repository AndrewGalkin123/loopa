import { TrendingDown } from "lucide-react";
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
  "selection-sort",
  "insertion-sort",
  "quick-sort",
  "merge-sort",
  "heap-sort",
  "binary-search",
  "linear-search",
  "interpolation-search",
  "bfs",
  "dfs",
  "dijkstra",
  "bellman-ford",
  "levit",
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

// An algorithm that got its page must be removed from PLANNED.
const twice = CARDS.find((card, i) => CARDS.findIndex((other) => other.slug === card.slug) !== i);
if (twice) throw new Error(`Catalog: "${twice.slug}" is both in the registry and in PLANNED`);

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
