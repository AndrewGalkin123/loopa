import { TrendingDown } from "lucide-react";
import type { CatalogCard } from "@/lib/catalog";

/*
 * Catalog cards of algorithms that are planned but have no page yet (texts from
 * design/Algorithms.html). They come after the algorithms of the registry.
 * When an algorithm gets its page, its card is removed from here — that is part
 * of registering it, like the lines in registry.ts and content.ts.
 */
export const PLANNED: Omit<CatalogCard, "num">[] = [
  {
    slug: "gradient-descent",
    group: "optimization",
    badge: { variant: "optimization", icon: TrendingDown, label: "opt" },
    title: "Gradient Descent",
    tagline: "iterate",
    description: {
      cs: "Iterativní optimalizace. Sestupuje po\u00a0gradientu k\u00a0lokálnímu minimu funkce.",
      en: "Iterative optimisation. It walks down the gradient to a local minimum of a function.",
    },
    complexity: "iterative",
    level: "advanced",
  },
];
