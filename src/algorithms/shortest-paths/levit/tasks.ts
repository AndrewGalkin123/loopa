import type { GraphTask } from "@/models/graph/tasks";

/* Tasks "find an input such that …" for Levit's algorithm (the graph and weights are changed in the editor). */
export const levitTasks: GraphTask[] = [
  {
    id: "processed-once",
    text: "Uprav graf (aspoň 4 dosažitelné vrcholy) tak, aby se žádný vrchol nevrátil z\u00a0M0 — každý se zpracuje jen jednou.",
    hint: "Vrchol se vrací z\u00a0M0, když se k\u00a0němu až po\u00a0jeho zpracování najde kratší cesta. Ať je první nalezená cesta vždy ta nejkratší.",
    explain:
      "Ke každému vrcholu se jako první našla rovnou nejkratší cesta, takže se nic nevrací z\u00a0M0 a\u00a0Levit zpracuje každý vrchol jen jednou — tak rychle jako BFS.",
    check: (_, steps) => {
      const done = steps[steps.length - 1].event;
      const reached = done.type === "done" && done.distances ? Object.values(done.distances).filter((d) => d !== Infinity).length : 0;
      const back = steps.filter((s) => s.event.type === "relax" && s.line === 13).length;
      if (reached < 4) return { done: false, status: `dosažitelné vrcholy: ${reached} · potřeba aspoň 4` };
      return { done: back === 0 && !(done.type === "done" && done.negativeCycle), status: `návraty z\u00a0M0: ${back} · cíl 0` };
    },
  },
  {
    id: "negative-cycle",
    text: "Přidej zápornou hranu tak, aby vznikl záporný cyklus.",
    hint: "Cyklus, jehož hrany mají dohromady zápornou váhu. Ze startu se do\u00a0něj musí dát dojít.",
    explain: "Kolem záporného cyklu by šlo vzdálenosti zmenšovat donekonečna, a\u00a0tak ho algoritmus ohlásí.",
    check: (_, steps) => {
      const done = steps[steps.length - 1].event;
      return { done: done.type === "done" && done.negativeCycle === true };
    },
  },
];
