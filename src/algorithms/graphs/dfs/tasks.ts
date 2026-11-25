import type { GraphTask } from "@/models/graph/tasks";

/* Tasks "find an input such that …" for DFS (the graph is changed in the editor). */
export const dfsTasks: GraphTask[] = [
  {
    id: "shallow",
    text: "Uprav graf (aspoň 4 vrcholy) tak, aby DFS navštívil všechny vrcholy, ale rekurze nešla hlouběji než do\u00a02 vrcholů.",
    hint: "Spoj start přímo se všemi ostatními vrcholy a\u00a0nic jiného.",
    explain:
      "Ze startu vede hrana ke každému vrcholu a\u00a0žádný z\u00a0nich nemá dalšího nenavštíveného souseda, takže se DFS z\u00a0každého hned vrátí. Hloubka rekurze závisí na\u00a0tvaru grafu, ne na\u00a0počtu vrcholů.",
    check: ({ graph }, steps) => {
      const depth = Math.max(...steps.map((s) => s.state.lists.find((l) => l.label === "stack")!.items.length));
      const visited = steps.filter((s) => s.event.type === "visit").length;
      if (graph.nodes.length < 4) return { done: false, status: "přidej vrcholy: aspoň 4" };
      return { done: depth <= 2 && visited === graph.nodes.length, status: `největší hloubka: ${depth} · navštíveno ${visited} z\u00a0${graph.nodes.length}` };
    },
  },
  {
    id: "alphabetical",
    text: "Uprav graf tak, aby DFS navštívil všechny vrcholy v\u00a0abecedním pořadí.",
    hint: "DFS jde vždy k\u00a0abecedně prvnímu nenavštívenému sousedovi.",
    explain: "DFS bere sousedy podle abecedy a\u00a0v\u00a0tomto grafu ho to vede přesně po\u00a0řadě A, B, C, …",
    check: ({ graph }, steps) => {
      const order = steps.flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
      const alphabetical = graph.nodes.map((n) => n.id).sort();
      return { done: order.join() === alphabetical.join(), status: `pořadí: ${order.join(", ")}` };
    },
  },
];
