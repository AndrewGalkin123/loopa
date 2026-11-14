import type { KeyState } from "@/core/types";
import { vertex } from "@/models/graph/snapshot";
import type { GraphStep } from "@/models/graph/types";

/** Still pictures for the control condition of the research: the start, then the graph after every closed vertex. */
export function dijkstraKeyStates(steps: GraphStep[]): KeyState[] {
  const start = steps[0].event.type === "start" ? steps[0].event.node : "";
  const states: KeyState[] = [{ step: 0, caption: ["start", vertex(start, "frontier"), "d = 0"] }];
  const distance: Record<string, number> = { [start]: 0 };
  steps.forEach((step, i) => {
    if (step.event.type === "relax") distance[step.event.to] = step.event.distance;
    if (step.event.type !== "visit") return;
    // The last step before the next vertex is closed (or before the end): all its edges are checked.
    const next = steps.findIndex((s, j) => j > i && (s.event.type === "visit" || s.event.type === "done"));
    const u = step.event.node;
    states.push({ step: next - 1, caption: ["po uzavření", vertex(u, "active"), `(d = ${distance[u]}) a kontrole jeho hran`] });
  });
  return states;
}
