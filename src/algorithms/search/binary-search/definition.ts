import { Search } from "lucide-react";
import { defineSearchAlgorithm } from "@/models/search/types";
import { binarySearchTasks } from "./tasks";
import { binarySearchTrace } from "./trace";

const COUNTERS = [
  { key: "probes", label: "probes" },
  { key: "left", label: "left" },
];

export const binarySearch = defineSearchAlgorithm({
  slug: "binary-search",
  name: "Binary Search",
  group: "search",
  level: "beginner",
  complexity: "O(log n)",
  requiresSorted: true,
  card: {
    tagline: "halve",
    description: "Vyhledávání v seřazeném poli. V každém kroku zahodí polovinu prostoru.",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
  },
  trace: binarySearchTrace,
  tasks: binarySearchTasks,
  // 3–4 lead to the comparison, 7 to moving lo, 9 to moving hi.
  lineAliases: { 1: 2, 3: 5, 4: 5, 7: 8, 9: 10 },
  counters: COUNTERS,
  legend: ["default", "compared", "sorted", "dimmed", "target"],
  initialInput: { values: [3, 7, 12, 18, 21, 29, 34, 41, 47, 55, 63, 66, 76, 88, 90], target: 29 },
  initialInputKind: "random",
  inputHints: { skewed: "na binární půlení nemá vliv" },
});
