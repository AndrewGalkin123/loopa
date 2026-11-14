import type { KeyState } from "@/core/types";
import { vertex } from "@/models/graph/snapshot";
import type { GraphStep } from "@/models/graph/types";

/** Still pictures for the control condition of the research: the start, then the graph after every processed vertex. */
export function bfsKeyStates(steps: GraphStep[]): KeyState[] {
  const start = steps[0].event.type === "start" ? steps[0].event.node : "";
  const states: KeyState[] = [{ step: 0, caption: ["start", vertex(start, "frontier")] }];
  steps.forEach((step, i) => {
    if (step.event.type !== "visit") return;
    // The last step before the next vertex is taken from the queue (or before the end).
    const next = steps.findIndex((s, j) => j > i && (s.event.type === "visit" || s.event.type === "done"));
    const queue = steps[next - 1].state.lists[0].items;
    states.push({
      step: next - 1,
      caption: ["po zpracování", vertex(step.event.node, "active"), `— fronta: ${queue.length > 0 ? queue.join(", ") : "prázdná"}`],
    });
  });
  return states;
}
