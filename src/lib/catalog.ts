import { PLANNED } from "@/algorithms/planned";
import { ALGORITHMS } from "@/algorithms/registry";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";
import type { AlgorithmDefinition } from "@/core/types";

/*
 * Cards of the algorithm catalog. Cards of algorithms that have a page are built
 * from their definition.ts, in the order of the registry; after them come the
 * planned ones without a page (src/algorithms/planned.ts). So adding an algorithm
 * never changes this file. The landing page has its own, slightly different texts.
 */

export type CatalogCard = AlgorithmCardData & { slug: string };

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

/** The order gives the card numbers 01, 02, … */
export const CATALOG: CatalogCard[] = CARDS.map((card, i) => ({ ...card, num: String(i + 1).padStart(2, "0") }));

/** The catalog card of an algorithm (used for the "related" cards on algorithm pages). */
export function catalogCard(slug: string): CatalogCard {
  const card = CATALOG.find((c) => c.slug === slug);
  if (!card) throw new Error(`Catalog: unknown algorithm "${slug}"`);
  return card;
}
