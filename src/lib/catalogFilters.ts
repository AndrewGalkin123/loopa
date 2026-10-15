import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/* Filtering and sorting of the algorithm catalog (search, group, level, sort). */

export type Category = "all" | "sorting" | "search" | "graphs" | "math";
export type Level = "all" | "beginner" | "intermediate" | "advanced";
export type SortOrder = "number" | "name" | "level";

export interface CatalogFilters {
  query: string;
  category: Category;
  level: Level;
  sort: SortOrder;
}

export const DEFAULT_FILTERS: CatalogFilters = { query: "", category: "all", level: "all", sort: "number" };

/** Group chips; each covers one or more card groups ("graphs" = traversal + shortest paths). */
export const CATEGORIES: { id: Category; label: string; groups: string[] }[] = [
  { id: "all", label: "All", groups: [] },
  { id: "sorting", label: "Sorting", groups: ["sorting"] },
  { id: "search", label: "Search", groups: ["search-sorted"] },
  { id: "graphs", label: "Graphs", groups: ["graph-traversal", "shortest-path"] },
  { id: "math", label: "Math", groups: ["optimization"] },
];

export const LEVELS: { id: Level; label: string }[] = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const SORTS: { id: SortOrder; label: string }[] = [
  { id: "number", label: "by number" },
  { id: "name", label: "by name" },
  { id: "level", label: "by level" },
];

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

/** "Řazení" → "razeni": lower case without diacritics, so the search ignores both. */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function inCategory(card: AlgorithmCardData, category: Category): boolean {
  if (category === "all") return true;
  return CATEGORIES.find((c) => c.id === category)!.groups.includes(card.group);
}

/** Cards that pass all filters, in the chosen order. */
export function filterCatalog(cards: AlgorithmCardData[], filters: CatalogFilters): AlgorithmCardData[] {
  const query = normalize(filters.query.trim());
  const result = cards.filter(
    (card) =>
      inCategory(card, filters.category) &&
      (filters.level === "all" || card.level === filters.level) &&
      // Search by name only ("sort" must not find Binary Search through its group "search-sorted").
      (query === "" || normalize(card.title).includes(query)),
  );

  switch (filters.sort) {
    case "name":
      return result.sort((a, b) => a.title.localeCompare(b.title, "cs"));
    case "level":
      return result.sort(
        (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) || a.num.localeCompare(b.num),
      );
    case "number":
      return result.sort((a, b) => a.num.localeCompare(b.num));
  }
}
