import { ListOrdered } from "lucide-react";
import { defineSearchAlgorithm } from "@/models/search/types";
import { linearSearchTasks } from "./tasks";
import { linearSearchTrace } from "./trace";

const COUNTERS = [
  { key: "probes", label: "probes" },
  { key: "left", label: "left" },
];

export const linearSearch = defineSearchAlgorithm({
  slug: "linear-search",
  name: "Linear Search",
  group: "search",
  level: "beginner",
  complexity: "O(n)",
  requiresSorted: false,
  card: {
    tagline: "scan",
    description: "Sekvenční průchod polem. Nejjednodušší vyhledávání bez požadavku na uspořádání.",
    badge: { variant: "search-sorted", icon: ListOrdered, label: "lin" },
  },
  trace: linearSearchTrace,
  tasks: linearSearchTasks,
  // Line 2 is the loop: it leads to the comparison.
  lineAliases: { 2: 3 },
  counters: COUNTERS,
  legend: ["default", "compared", "sorted", "dimmed", "target"],
  legendDescriptions: { default: "zatím neprohlédnutý", dimmed: "už prohlédnutý" },
  initialInput: { values: [34, 7, 88, 21, 63, 12, 55, 90, 3, 47, 76, 18, 29, 66, 41], target: 47 },
  initialInputKind: "shuffled",
});
