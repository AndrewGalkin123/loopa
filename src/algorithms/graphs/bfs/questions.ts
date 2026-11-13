import type { NotePart, Question } from "@/core/types";
import { vertex } from "@/models/graph/snapshot";
import type { GraphStep } from "@/models/graph/types";

/*
 * Questions of the mode Předpověz for BFS: when a vertex is taken from the queue —
 * which vertices will be put into the queue, and in what order? The answer are the
 * "discover" steps up to the next dequeued vertex.
 */
export function bfsQuestions(steps: GraphStep[]): Question[] {
  return steps.flatMap((step, at) => {
    if (step.event.type !== "visit") return [];
    const u = step.event.node;
    const rest = steps.slice(at + 1);
    const own = rest.slice(0, rest.findIndex((s) => s.event.type === "visit" || s.event.type === "done"));
    const added = own.flatMap((s) => (s.event.type === "discover" ? [s.event.node] : []));
    const checked = own.flatMap((s) => (s.event.type === "examine" ? [s.event.to] : []));
    return [
      {
        at,
        prompt: ["Které vrcholy přidá", vertex(u, "active"), "do fronty? Klikej na ně v pořadí, ve kterém se přidají."],
        answer: { kind: "sequence", correct: added },
        explain: why(u, checked, added),
      },
    ];
  });
}

function why(u: string, checked: string[], added: string[]): NotePart[] {
  if (checked.length === 0) return [`${u} nemá žádné sousedy, fronta se nezmění.`];
  if (added.length === 0) return [`Všichni sousedé ${u} (${checked.join(", ")}) už jsou navštívení, fronta se nezmění.`];
  const seen = checked.filter((v) => !added.includes(v));
  const visited = seen.length === 0 ? "" : ` ${seen.join(", ")} už ${seen.length === 1 ? "je navštívený" : "jsou navštívení"}.`;
  return [`Do fronty jdou ${added.join(", ")} — nenavštívení sousedé ${u} v abecedním pořadí.${visited}`];
}
