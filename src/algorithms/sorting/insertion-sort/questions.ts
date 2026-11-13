import type { NotePart, Question } from "@/core/types";
import { ref } from "@/models/array/snapshot";
import type { ArrayStep } from "@/models/array/types";

/*
 * Questions of the mode Předpověz for Insertion Sort: at the start of every pass
 * (key ← A[i]) — where will the key be inserted? The answer is the step that
 * places the key (line 8).
 */
export function insertionSortQuestions(steps: ArrayStep[]): Question[] {
  return steps.flatMap((step, at) => {
    if (step.event.type !== "phase" || step.event.name !== "insert") return [];
    const from = step.event.range![1];
    const placed = steps.slice(at).find((s) => s.line === 8)!;
    if (placed.event.type !== "write") return [];
    const to = placed.event.at[0];
    const key = step.state.values[from];
    return [
      {
        at,
        prompt: ["Klíč", { text: String(key), mark: "pivot" }, "— kam se vloží? Klikni na sloupec."],
        answer: { kind: "pick", correct: [String(to)] },
        explain: why(step.state.values, from, to),
      },
    ];
  });
}

/** "Klíč 2 skončí na [0] — 4, 7 jsou větší a posunou se doprava, klíč je nejmenší a jde na začátek." */
function why(values: number[], from: number, to: number): NotePart[] {
  const key = values[from];
  const shifted = values.slice(to, from);
  if (shifted.length === 0) {
    return [`Klíč ${key} zůstane na`, ref(from, "pivot"), `— ${values[from - 1]} není větší, nic se neposune.`];
  }
  const moved = shifted.length === 1 ? `${shifted[0]} je větší a posune se` : `${shifted.join(", ")} jsou větší a posunou se`;
  const stop = to === 0 ? "klíč je nejmenší a jde na začátek." : `${values[to - 1]} ≤ ${key} zůstane.`;
  return [`Klíč ${key} skončí na`, ref(to, "pivot"), `— ${moved} doprava, ${stop}`];
}
