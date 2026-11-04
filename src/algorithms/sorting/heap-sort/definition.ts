import { Pyramid } from "lucide-react";
import { defineArrayAlgorithm } from "@/models/array/types";
import { heapSortTrace } from "./trace";

export const heapSort = defineArrayAlgorithm({
  slug: "heap-sort",
  name: "Heap Sort",
  group: "sorting",
  level: "intermediate",
  complexity: "O(n log n)",
  card: {
    tagline: "heap",
    description: "Řazení haldou. Z\u00a0pole postaví max-haldu a\u00a0pak z\u00a0ní opakovaně odebírá maximum na\u00a0konec pole.",
    badge: { variant: "sorting", icon: Pyramid, label: "heap" },
  },
  trace: heapSortTrace,
  // 1 has no step of its own; the calls (4, 7, 19) and the procedure (9) start sifting at line 10;
  // 11, 12 and 14 lead to the comparison on line 13, 16 to the one on line 15.
  lineAliases: { 1: 2, 4: 10, 7: 10, 9: 10, 11: 13, 12: 13, 14: 13, 16: 15, 19: 10 },
  counters: [
    { key: "cmp", label: "cmp" },
    { key: "swp", label: "swp" },
  ],
  legend: ["default", "active", "compared", "pivot", "sorted"],
  legendDescriptions: { pivot: "prosévaný prvek" },
  // The same array as on the other sorting pages, so the runs can be compared.
  initialInput: [4, 7, 2, 11, 9, 14, 6, 12, 3, 15, 1, 8, 13, 5, 10],
  inputHints: { random: "O(n log n)", nearly: "O(n log n)", sorted: "O(n log n)", reversed: "O(n log n)" },
});
