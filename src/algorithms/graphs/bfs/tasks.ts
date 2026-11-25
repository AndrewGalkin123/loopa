import { atLeast } from "@/core/tasks";
import type { GraphTask } from "@/models/graph/tasks";
import type { GraphStep } from "@/models/graph/types";

/** d of every reached vertex, from the events: the start has 0, a discovered vertex one more than its parent. */
function distances(steps: GraphStep[]) {
  const d: Record<string, number> = {};
  for (const { event } of steps) {
    if (event.type === "start") d[event.node] = 0;
    if (event.type === "discover") d[event.node] = d[event.from] + 1;
  }
  return d;
}

/* Tasks "find an input such that …" for BFS (the graph is changed in the editor). */
export const bfsTasks: GraphTask[] = [
  {
    id: "far-vertex",
    text: "Uprav graf tak, aby nejvzdálenější vrchol měl d ≥ 4.",
    hint: "Vzdálenost roste jen podél cesty. Protáhni graf do\u00a0délky a\u00a0zruš zkratky.",
    explain: "K\u00a0vrcholu vedou od startu nejméně 4 hrany, takže ho BFS objeví až ve\u00a0čtvrté vlně.",
    check: (_, steps) => atLeast("největší d", Math.max(...Object.values(distances(steps))), 4),
  },
  {
    id: "unreached",
    text: "Uprav graf tak, aby BFS nedosáhl všech vrcholů.",
    hint: "Odeber hrany tak, aby se graf rozpadl na\u00a0dvě části.",
    explain: "Do\u00a0vrcholů v\u00a0jiné části grafu nevede ze startu žádná cesta, a\u00a0tak se nikdy nedostanou do\u00a0fronty.",
    check: ({ graph }, steps) => {
      const reached = Object.keys(distances(steps)).length;
      return { done: reached < graph.nodes.length, status: `dosaženo: ${reached} z\u00a0${graph.nodes.length}` };
    },
  },
  {
    id: "wide-queue",
    text: "Uprav graf tak, aby ve frontě čekaly najednou aspoň 4 vrcholy.",
    hint: "Kolik sousedů má start? Všichni po\u00a0jeho zpracování čekají ve frontě.",
    explain: "Vrchol s\u00a0mnoha nenavštívenými sousedy je přidá do\u00a0fronty naráz — fronta je široká jako vlna BFS.",
    check: (_, steps) => atLeast("nejdelší fronta", Math.max(...steps.map((s) => s.state.lists[0].items.length)), 4),
  },
];
