import { Route } from "lucide-react";
import { WEIGHTED_PRESETS } from "@/models/graph/presets";
import { defineGraphAlgorithm } from "@/models/graph/types";
import { dijkstraTrace } from "./trace";

export const dijkstra = defineGraphAlgorithm({
  slug: "dijkstra",
  name: "Dijkstra",
  group: "shortest-path",
  level: "advanced",
  complexity: "O(E log V)",
  card: {
    tagline: "greedy",
    description: "Nejkratší cesty z jednoho zdroje ve váženém grafu s nezápornými hranami.",
    badge: { variant: "shortest", icon: Route, label: "path" },
  },
  trace: dijkstraTrace,
  // 1–4 prepare the arrays (one step at line 5); 6, 8 belong to closing a vertex; 9 to the check; 12 to the update.
  lineAliases: { 1: 5, 2: 5, 3: 5, 4: 5, 6: 7, 8: 7, 9: 10, 12: 11 },
  counters: [
    { key: "closed", label: "closed" },
    { key: "relax", label: "relax" },
  ],
  legend: ["default", "frontier", "active", "compared", "done"],
  legendDescriptions: { frontier: "ve frontě", done: "uzavřený" },
  weighted: { directed: false, minWeight: 0, maxWeight: 99, presets: WEIGHTED_PRESETS },
  initialInput: { graph: WEIGHTED_PRESETS[0].graph, start: "A" },
  initialInputKind: "network",
});
