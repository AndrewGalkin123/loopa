import { ArrowDownToLine } from "lucide-react";
import { defineArrayAlgorithm } from "@/models/array/types";
import { insertionSortQuestions } from "./questions";
import { insertionSortTrace } from "./trace";

export const insertionSort = defineArrayAlgorithm({
  slug: "insertion-sort",
  name: "Insertion Sort",
  group: "sorting",
  level: "beginner",
  complexity: "O(n²)",
  card: {
    tagline: "adaptive",
    description: "Řazení vkládáním. Bere prvky jeden po\u00a0druhém a\u00a0vkládá je na\u00a0správné místo v\u00a0seřazené části.",
    badge: { variant: "sorting", icon: ArrowDownToLine, label: "insert" },
  },
  trace: insertionSortTrace,
  questions: insertionSortQuestions,
  // 2 and 4 only prepare the pass, 7 only moves the index j.
  lineAliases: { 2: 3, 4: 3, 7: 6 },
  // Insertion Sort does not swap, it shifts values to the right.
  counters: [
    { key: "cmp", label: "cmp" },
    { key: "shf", label: "shf" },
  ],
  legend: ["default", "active", "compared", "pivot", "sorted", "dimmed"],
  legendDescriptions: { pivot: "klíč", dimmed: "zatím nezařazeno" },
  // The same array as on the other sorting pages, so the runs can be compared.
  // (Deliberately not the arrays of the research tests in docs/research.)
  initialInput: [4, 7, 2, 11, 9, 14, 6, 12, 3, 15, 1, 8, 13, 5, 10],
  inputHints: { nearly: "skoro lineární", sorted: "nejlepší případ", reversed: "nejhorší případ" },
});
