import type { Question } from "@/core/types";
import { ref, span } from "@/models/array/snapshot";
import type { ArrayStep } from "@/models/array/types";

/*
 * Questions of the mode Předpověz for Quick Sort:
 *  - at the start of every partition: where will the pivot end up?
 *  - in the first partition, at every comparison: will the value go left of the pivot?
 *    (Only in the first one — a question at every comparison would be too many.)
 */
export function quickSortQuestions(steps: ArrayStep[]): Question[] {
  const questions: Question[] = [];
  let partitions = 0;

  steps.forEach((step, at) => {
    const { event } = step;
    if (event.type === "phase" && event.name === "partition") {
      partitions++;
      const [lo, hi] = event.range!;
      const pivot = step.state.values[hi];
      // The pivot's place is the settle step that ends this partition (line 14).
      const settled = steps.slice(at).find((s) => s.event.type === "settle" && s.line === 14)!;
      const place = settled.event.type === "settle" ? settled.event.at : hi;
      questions.push({
        at,
        prompt: ["Pivot", { text: String(pivot), mark: "pivot" }, `— na kterém indexu úseku ${span(lo, hi)} skončí? Klikni na sloupec.`],
        answer: { kind: "pick", correct: [String(place)] },
        explain: [`Pivot ${pivot} skončí na`, ref(place, "sorted"), `— ${smaller(place - lo, pivot)}`],
      });
    } else if (event.type === "compare" && partitions === 1) {
      const value = step.state.values[event.i];
      const pivot = step.state.values[event.j];
      const left = value <= pivot;
      questions.push({
        at,
        prompt: ["Půjde", { text: String(value), mark: "compared" }, "doleva od pivotu", { text: `${pivot}?`, mark: "pivot" }],
        answer: { kind: "yes-no", correct: left },
        explain: [left ? `${value} ≤ ${pivot}: přidá se k levé části „≤ pivot“.` : `${value} > ${pivot}: zůstane vpravo, nic se nemění.`],
      });
    }
  });
  return questions;
}

/** How many values of the part are ≤ pivot — exactly that many go before it. */
function smaller(count: number, pivot: number): string {
  if (count === 0) return `v úseku není žádné číslo ≤ ${pivot}, pivot jde na začátek úseku.`;
  if (count === 1) return `v úseku je 1 číslo ≤ ${pivot}, to půjde před něj.`;
  return `v úseku ${count <= 4 ? `jsou ${count} čísla` : `je ${count} čísel`} ≤ ${pivot}, ta půjdou před něj.`;
}
