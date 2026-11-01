import { Crosshair } from "lucide-react";
import { defineSearchAlgorithm } from "@/models/search/types";
import { interpolationSearchTrace } from "./trace";

const COUNTERS = [
  { key: "probes", label: "probes" },
  { key: "left", label: "left" },
];

export const interpolationSearch = defineSearchAlgorithm({
  slug: "interpolation-search",
  name: "Interpolation Search",
  group: "search",
  level: "intermediate",
  complexity: "O(log log n)",
  requiresSorted: true,
  card: {
    tagline: "estimate",
    description: "Hledá v seřazeném poli tam, kde hodnota podle odhadu leží. Na rovnoměrných datech bleskový.",
    badge: { variant: "search-sorted", icon: Crosshair, label: "int" },
  },
  trace: interpolationSearchTrace,
  // 1 → the start; 3, 4, 6 lead to the estimate; 10 to moving lo, 12 to moving hi.
  lineAliases: { 1: 2, 3: 7, 4: 7, 6: 7, 10: 11, 12: 13 },
  counters: COUNTERS,
  legend: ["default", "compared", "sorted", "dimmed", "target"],
  // An array where the estimate misses on both sides, so lo and hi both move.
  initialInput: { values: [8, 19, 28, 40, 45, 54, 64, 65, 66, 70, 71, 74, 77, 81, 94], target: 54 },
  initialInputKind: "random",
  inputHints: { uniform: "nejlepší případ: jeden pohled", skewed: "špatný odhad, skoro lineární" },
});
