import { ArrowLeftRight } from "lucide-react";
import { DIRECTED_PRESETS } from "@/models/graph/presets";
import { defineGraphAlgorithm } from "@/models/graph/types";
import { levitTasks } from "./tasks";
import { levitTrace } from "./trace";

export const levit = defineGraphAlgorithm({
  slug: "levit",
  name: "Levit",
  group: "shortest-path",
  level: "advanced",
  complexity: "exp. (worst)",
  card: {
    tagline: "deque",
    description: "Tři množiny vrcholů a dvoustranná fronta. V praxi rychlý, zvládne záporné hrany.",
    badge: { variant: "shortest", icon: ArrowLeftRight, label: "lev" },
  },
  trace: levitTrace,
  tasks: levitTasks,
  // 1–3 prepare the arrays; 5 is the loop; 7 the for; 10 and 12 lead to moving the vertex into M1.
  lineAliases: { 1: 4, 2: 4, 3: 4, 5: 6, 7: 8, 10: 11, 12: 13 },
  counters: [
    { key: "pops", label: "pops" },
    { key: "relax", label: "relax" },
  ],
  legend: ["default", "frontier", "active", "compared", "done"],
  legendDescriptions: { default: "M2: nedosažený", frontier: "M1: ve frontě", done: "M0: spočítaný" },
  weighted: { directed: true, minWeight: -99, maxWeight: 99, presets: DIRECTED_PRESETS },
  initialInput: { graph: DIRECTED_PRESETS[0].graph, start: "A" },
  initialInputKind: "negative",
});
