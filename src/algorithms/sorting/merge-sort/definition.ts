import { Layers } from "lucide-react";
import { defineArrayAlgorithm } from "@/models/array/types";
import { mergeSortTrace } from "./trace";

export const mergeSort = defineArrayAlgorithm({
  slug: "merge-sort",
  name: "Merge Sort",
  group: "sorting",
  level: "intermediate",
  complexity: "O(n log n)",
  card: {
    tagline: "stable",
    description: "Stabilní třídění shora dolů. Rozdělí pole, seřadí poloviny a\u00a0poté je sloučí.",
    badge: { variant: "sorting", icon: Layers, label: "stable" },
  },
  trace: mergeSortTrace,
  // 2, 4, 5: recursion → split; 6, 8: merge; 10, 11, 16: loop bookkeeping → compare; 14 → else branch.
  lineAliases: { 2: 3, 4: 3, 5: 3, 6: 9, 8: 9, 10: 12, 11: 12, 14: 15, 16: 12 },
  // Merge Sort does not swap, it writes values into the array.
  counters: [
    { key: "cmp", label: "cmp" },
    { key: "wrt", label: "wrt" },
  ],
  legend: ["default", "active", "compared", "sorted", "dimmed"],
  // The same array as on the other sorting pages, so the runs can be compared.
  initialInput: [4, 7, 2, 11, 9, 14, 6, 12, 3, 15, 1, 8, 13, 5, 10],
  // Sorted and reversed input: one half always runs out first, so about half the comparisons.
  inputHints: { random: "průměrný případ", sorted: "méně porovnání", reversed: "méně porovnání" },
});
