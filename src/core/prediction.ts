import type { Answer, PredictionView, Reply } from "./types";

/* The mode "Předpověz": checking an answer and how the picture marks it. */

/** Is the reply right? A pick may have several right ids (e.g. vertices with the same distance). */
export function isCorrect(answer: Answer, reply: Reply): boolean {
  switch (answer.kind) {
    case "yes-no":
      return reply === answer.correct;
    case "pick":
      return Array.isArray(reply) && reply.length === 1 && answer.correct.includes(reply[0]);
    case "sequence":
      return Array.isArray(reply) && reply.length === answer.correct.length && reply.every((id, i) => id === answer.correct[i]);
  }
}

/**
 * Class of a bar / vertex during a question: clickable, chosen, and after the answer
 * right (green) or wrong (red). Empty when the picture is not part of the question.
 */
export function pickClass(id: string, prediction: PredictionView | undefined): string {
  if (!prediction) return "";
  const { onPick, chosen, correct } = prediction;
  if (correct) {
    if (correct.includes(id)) return "pick-right";
    return chosen.includes(id) ? "pick-wrong" : "";
  }
  if (chosen.includes(id)) return "pick-chosen";
  return onPick ? "pickable" : "";
}
