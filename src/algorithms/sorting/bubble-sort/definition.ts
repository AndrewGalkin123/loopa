import { ArrowUpNarrowWide } from "lucide-react";
import { defineArrayAlgorithm } from "@/models/array/types";
import { bubbleSortTrace } from "./trace";

export const bubbleSort = defineArrayAlgorithm({
  slug: "bubble-sort",
  name: "Bubble Sort",
  group: "sorting",
  level: "beginner",
  complexity: "O(n²)",
  card: {
    tagline: "simple",
    description: "Jednoduchý algoritmus třídění. Porovnává a\u00a0vyměňuje sousední prvky, dokud není pole seřazené.",
    badge: { variant: "sorting", icon: ArrowUpNarrowWide, label: "sort" },
  },
  trace: bubbleSortTrace,
  // Lines 1, 3, 5 and 8 have no step of their own.
  lineAliases: { 1: 2, 3: 4, 5: 6, 8: 7 },
  counters: [
    { key: "cmp", label: "cmp" },
    { key: "swp", label: "swp" },
  ],
  legend: ["default", "active", "compared", "sorted"],
  // The bars of the design: a shuffled 1..15.
  initialInput: [4, 7, 2, 11, 9, 14, 6, 12, 3, 15, 1, 8, 13, 5, 10],
  inputHints: { sorted: "nejlepší případ", reversed: "nejhorší případ" },
});
