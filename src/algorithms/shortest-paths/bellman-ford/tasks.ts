import { atLeast } from "@/core/tasks";
import type { GraphTask } from "@/models/graph/tasks";

/* Tasks "find an input such that …" for Bellman–Ford (the graph and weights are changed in the editor). */
export const bellmanFordTasks: GraphTask[] = [
  {
    id: "negative-cycle",
    text: "Přidej zápornou hranu tak, aby vznikl záporný cyklus.",
    hint: "Cyklus, jehož hrany mají dohromady zápornou váhu. Ze startu se do\u00a0něj musí dát dojít.",
    explain: "Po\u00a0V − 1 průchodech jde některou vzdálenost ještě zmenšit. To dokáže jen záporný cyklus, a\u00a0tak ho algoritmus ohlásí.",
    check: (_, steps) => {
      const done = steps[steps.length - 1].event;
      return { done: done.type === "done" && done.negativeCycle === true };
    },
  },
  {
    id: "four-passes",
    text: "Uprav graf tak, aby Bellman–Ford potřeboval aspoň 4 průchody.",
    hint: "Hrany se v\u00a0průchodu berou v\u00a0abecedním pořadí. Postav cestu ze startu, jejíž hrany jdou v\u00a0opačném pořadí.",
    explain:
      "Proti pořadí hran se vzdálenost za\u00a0jeden průchod posune jen o\u00a0jednu hranu cesty, a\u00a0tak je potřeba víc průchodů. Poslední průchod jen potvrdí, že se už nic nemění.",
    check: (_, steps) => atLeast("průchody", steps[steps.length - 1].counters.pass, 4),
  },
];
