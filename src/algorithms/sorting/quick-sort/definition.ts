import { Zap } from "lucide-react";
import { defineArrayAlgorithm } from "@/models/array/types";
import { quickSortTrace } from "./trace";

export const quickSort = defineArrayAlgorithm({
  slug: "quick-sort",
  name: "Quick Sort",
  group: "sorting",
  level: "intermediate",
  complexity: "O(n log n)",
  card: {
    tagline: "divide",
    description: "Rozděl a\u00a0panuj. Volí pivot a\u00a0rekurzivně třídí dvě poloviny pole.",
    badge: { variant: "sorting", icon: Zap, label: "fast" },
  },
  trace: quickSortTrace,
  // Lines 3–5 are the recursion, 9 and 12 only move the index i, 15 returns.
  lineAliases: { 3: 8, 4: 8, 5: 8, 7: 8, 9: 11, 10: 11, 12: 13, 15: 14 },
  counters: [
    { key: "cmp", label: "cmp" },
    { key: "swp", label: "swp" },
  ],
  legend: ["default", "active", "compared", "pivot", "sorted", "dimmed"],
  // The same array as on the other sorting pages, so the runs can be compared.
  // (Deliberately not the arrays of the research tests in docs/research.)
  initialInput: [4, 7, 2, 11, 9, 14, 6, 12, 3, 15, 1, 8, 13, 5, 10],
  inputHints: { random: "průměrný případ", sorted: "nejhorší případ", reversed: "nejhorší případ" },
});
