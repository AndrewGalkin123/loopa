import { TrendingDown } from "lucide-react";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/*
 * Catalog cards of algorithms that are planned but have no page yet (texts from
 * design/Algorithms.html). They come after the algorithms of the registry.
 * When an algorithm gets its page, its card is removed from here — that is part
 * of registering it, like the lines in registry.ts and content.ts.
 */
export const PLANNED: (Omit<AlgorithmCardData, "num"> & { slug: string })[] = [
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
