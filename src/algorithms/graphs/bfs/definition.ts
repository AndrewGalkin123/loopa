import { GitBranch } from "lucide-react";
import { PRESETS } from "@/models/graph/presets";
import { defineGraphAlgorithm } from "@/models/graph/types";
import { bfsTrace } from "./trace";

export const bfs = defineGraphAlgorithm({
  slug: "bfs",
  name: "BFS",
  group: "graph-traversal",
  level: "intermediate",
  complexity: "O(V + E)",
  card: {
    tagline: "ripples",
    description: "Procházení grafu po\u00a0vrstvách. Najde nejkratší cestu v\u00a0neváženém grafu.",
    badge: { variant: "graph", icon: GitBranch, label: "bfs" },
  },
  trace: bfsTrace,
  // 1–3 prepare the arrays (one step at line 4), 5 is the loop, 7 the for, 9–10 belong to the enqueue.
  lineAliases: { 1: 4, 2: 4, 3: 4, 5: 6, 7: 8, 9: 11, 10: 11 },
  counters: [
    { key: "nodes", label: "nodes" },
    { key: "edges", label: "edges" },
  ],
  legend: ["default", "frontier", "active", "compared", "done"],
  legendDescriptions: { frontier: "ve frontě" },
  initialInput: { graph: PRESETS.find((p) => p.id === "cycles")!.graph, start: "A" },
  initialInputKind: "cycles",
  inputHints: { tree: "strom — BFS jde po patrech", components: "BFS nedojde všude" },
});
