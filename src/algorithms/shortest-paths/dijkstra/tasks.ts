import { atLeast } from "@/core/tasks";
import type { GraphTask } from "@/models/graph/tasks";

/* Tasks "find an input such that …" for Dijkstra's algorithm (weights are changed in the editor). */
export const dijkstraTasks: GraphTask[] = [
  {
    id: "three-relaxations",
    text: "Uprav graf tak, aby se vzdálenost některého vrcholu během běhu zmenšila třikrát.",
    hint: "K\u00a0jednomu vrcholu veď tři cesty. Každá další, kterou Dijkstra najde, ať je kratší než ta předchozí.",
    explain:
      "Vrchol dostal první odhad d a\u00a0potom ještě dvakrát kratší cestu přes další uzavřené vrcholy. Relaxace odhad zlepšuje, dokud se vrchol neuzavře.",
    check: (_, steps) => {
      const relaxed: Record<string, number> = {};
      for (const { event } of steps) if (event.type === "relax") relaxed[event.to] = (relaxed[event.to] ?? 0) + 1;
      return atLeast("nejvíc zmenšení d u\u00a0jednoho vrcholu", Math.max(0, ...Object.values(relaxed)), 3);
    },
  },
  {
    id: "alphabetical",
    text: "Uprav váhy tak, aby Dijkstra uzavíral všechny vrcholy v\u00a0abecedním pořadí.",
    hint: "Vrcholy se uzavírají podle d. Jak musí d vrcholů vypadat?",
    explain: "Dijkstra uzavírá vrcholy podle rostoucího d. Tady d roste v\u00a0abecedním pořadí, a\u00a0tak se v\u00a0něm vrcholy i\u00a0uzavírají.",
    check: ({ graph }, steps) => {
      const order = steps.flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
      const alphabetical = graph.nodes.map((n) => n.id).sort();
      return { done: order.join() === alphabetical.join(), status: `pořadí uzavírání: ${order.join(", ")}` };
    },
  },
];
