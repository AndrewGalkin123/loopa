import { GitFork } from "lucide-react";
import { PRESETS } from "@/models/graph/presets";
import { defineGraphAlgorithm } from "@/models/graph/types";
import { dfsTasks } from "./tasks";
import { dfsTrace } from "./trace";

export const dfs = defineGraphAlgorithm({
  slug: "dfs",
  name: "DFS",
  group: "graph-traversal",
  level: "intermediate",
  complexity: "O(V + E)",
  card: {
    tagline: "deepen",
    description: "Procházení grafu do\u00a0hloubky. Základ pro topologické řazení i\u00a0hledání cyklů.",
    badge: { variant: "graph", icon: GitFork, label: "dfs" },
  },
  trace: dfsTrace,
  tasks: dfsTasks,
  // 1–2 prepare the array (one step at line 3), 5 enters visit, 7 is the for, 9 calls visit again.
  lineAliases: { 1: 3, 2: 3, 5: 6, 7: 8, 9: 6 },
  counters: [
    { key: "nodes", label: "nodes" },
    { key: "edges", label: "edges" },
  ],
  legend: ["default", "frontier", "active", "compared", "done"],
  legendDescriptions: { frontier: "na zásobníku" },
  initialInput: { graph: PRESETS.find((p) => p.id === "cycles")!.graph, start: "A" },
  initialInputKind: "cycles",
  inputHints: { tree: "strom — DFS jde do hloubky", components: "DFS nedojde všude" },
});
