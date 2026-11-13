import type { Question } from "@/core/types";
import { edgesFrom } from "@/models/graph/snapshot";
import type { GraphStep } from "@/models/graph/types";

/*
 * Questions of the mode Předpověz for Dijkstra's algorithm:
 *  - checking an edge u → v to a vertex that is not closed: will d[v] decrease?
 *  - one step before a vertex is closed: which one will it be? Every vertex with the
 *    smallest d is a right answer (ties are broken alphabetically, but that is a
 *    convention, not the idea). Asked only when there is more than one candidate.
 * The distances are followed from the events: start (d = 0) and relax.
 */
export function dijkstraQuestions(steps: GraphStep[]): Question[] {
  const questions: Question[] = [];
  const distance: Record<string, number> = {};
  const closed = new Set<string>();

  steps.forEach((step, at) => {
    const { event } = step;
    if (event.type === "start") distance[event.node] = 0;
    else if (event.type === "relax") distance[event.to] = event.distance;
    else if (event.type === "visit") closed.add(event.node);
    else if (event.type === "examine" && !closed.has(event.to)) {
      const { from: u, to: v } = event;
      const weight = edgesFrom(step.state.graph, u).find((edge) => edge.to === v)!.weight;
      const via = distance[u] + weight;
      const old = distance[v] ?? Infinity;
      const shown = old === Infinity ? "∞" : String(old);
      questions.push({
        at,
        prompt: ["Zmenší se", { text: `d[${v}]`, mark: "compared" }, "cestou přes", { text: `${u}?`, mark: "active" }],
        answer: { kind: "yes-no", correct: via < old },
        explain: [
          `d[${u}] + w(${u}, ${v}) = ${distance[u]} + ${weight} = ${via}`,
          via < old ? `< ${shown}, takže d[${v}] klesne na ${via}.` : `≥ ${shown}, d[${v}] zůstane ${shown}.`,
        ],
      });
    }

    const next = steps[at + 1]?.event;
    if (next?.type === "visit" && closed.size > 0) {
      const open = Object.keys(distance).filter((v) => !closed.has(v));
      if (open.length < 2) return;
      const smallest = Math.min(...open.map((v) => distance[v]));
      const best = open.filter((v) => distance[v] === smallest).sort();
      const others = best.filter((v) => v !== next.node);
      questions.push({
        at,
        prompt: ["Který vrchol se uzavře jako další? Klikni na vrchol."],
        answer: { kind: "pick", correct: best },
        explain: [
          `Uzavře se ${next.node}: má nejmenší d = ${smallest} ze všech vrcholů ve frontě.`,
          others.length === 0 ? "" : `Stejné d má i ${others.join(", ")} — správně je kterýkoli, při shodě tu rozhoduje abeceda.`,
        ].filter(Boolean),
        // The queue is sorted by d, so it would show the answer.
        hide: ["queue"],
      });
    }
  });
  return questions;
}
