import { Repeat } from "lucide-react";
import { DIRECTED_PRESETS } from "@/models/graph/presets";
import { defineGraphAlgorithm } from "@/models/graph/types";
import { bellmanFordTasks } from "./tasks";
import { bellmanFordTrace } from "./trace";

export const bellmanFord = defineGraphAlgorithm({
  slug: "bellman-ford",
  name: "Bellman-Ford",
  group: "shortest-path",
  level: "advanced",
  complexity: "O(V · E)",
  card: {
    tagline: "relax",
    description: "Opakovaně uvolňuje všechny hrany. Zvládne záporné váhy a odhalí záporný cyklus.",
    badge: { variant: "shortest", icon: Repeat, label: "bf" },
  },
  trace: bellmanFordTrace,
  tasks: bellmanFordTasks,
  // 1–2 prepare the arrays; 4 and 6 belong to a pass and to checking an edge; 9 to the update; 10 to the end.
  lineAliases: { 1: 3, 2: 3, 4: 5, 6: 7, 9: 8, 10: 11 },
  counters: [
    { key: "pass", label: "pass" },
    { key: "relax", label: "relax" },
  ],
  legend: ["default", "frontier", "active", "compared", "done"],
  legendDescriptions: { frontier: "d je známé", active: "začátek hrany", compared: "konec hrany" },
  weighted: { directed: true, minWeight: -99, maxWeight: 99, presets: DIRECTED_PRESETS },
  initialInput: { graph: DIRECTED_PRESETS[0].graph, start: "A" },
  initialInputKind: "negative",
});
