import { Crosshair } from "lucide-react";
import { defineArrayAlgorithm } from "@/models/array/types";
import { selectionSortTrace } from "./trace";

export const selectionSort = defineArrayAlgorithm({
  slug: "selection-sort",
  name: "Selection Sort",
  group: "sorting",
  level: "beginner",
  complexity: "O(n²)",
  card: {
    tagline: "minimum",
    description: "Řazení výběrem. V neseřazené části vždy najde minimum a vymění ho s jejím prvním prvkem.",
    badge: { variant: "sorting", icon: Crosshair, label: "select" },
  },
  trace: selectionSortTrace,
  // Line 1 has no step of its own, 3 and 5 are only the loops.
  lineAliases: { 1: 2, 3: 4, 5: 6 },
  counters: [
    { key: "cmp", label: "cmp" },
    { key: "swp", label: "swp" },
  ],
  legend: ["default", "active", "compared", "pivot", "sorted"],
  legendDescriptions: { pivot: "minimum" },
  // The same array as on the other sorting pages, so the runs can be compared.
  initialInput: [4, 7, 2, 11, 9, 14, 6, 12, 3, 15, 1, 8, 13, 5, 10],
  // The number of comparisons does not depend on the data at all.
  inputHints: { random: "vždy stejně", nearly: "vždy stejně", sorted: "vždy stejně", reversed: "vždy stejně" },
});
