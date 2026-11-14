import type { KeyState } from "@/core/types";
import { ref, span } from "@/models/array/snapshot";
import type { ArrayStep } from "@/models/array/types";

/** Still pictures for the control condition of the research: the input, the array after every partition, the end. */
export function quickSortKeyStates(steps: ArrayStep[]): KeyState[] {
  const states: KeyState[] = [{ step: 0, caption: ["vstup"] }];
  let range: [number, number] = [0, 0];
  let pivot = 0;
  steps.forEach((step, i) => {
    if (step.event.type === "phase" && step.event.name === "partition") {
      range = step.event.range!;
      pivot = step.state.values[range[1]];
    }
    // The settle step of line 14 ends a partition: the pivot is in its place.
    if (step.event.type === "settle" && step.line === 14) {
      states.push({ step: i, caption: [`po partition ${span(...range)}: pivot ${pivot} na`, ref(step.event.at, "sorted")] });
    }
  });
  states.push({ step: steps.length - 1, caption: ["seřazeno"] });
  return states;
}
