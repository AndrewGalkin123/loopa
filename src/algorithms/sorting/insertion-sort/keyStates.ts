import type { KeyState } from "@/core/types";
import { ref } from "@/models/array/snapshot";
import type { ArrayStep } from "@/models/array/types";

/** Still pictures for the control condition of the research: the input and the array after every pass. */
export function insertionSortKeyStates(steps: ArrayStep[]): KeyState[] {
  const states: KeyState[] = [{ step: 0, caption: ["vstup"] }];
  let pass = 0;
  let key = 0;
  steps.forEach((step, i) => {
    if (step.event.type === "phase" && step.event.name === "insert") {
      pass = step.event.range![1];
      key = step.state.values[pass];
    }
    if (step.line === 8 && step.event.type === "write") {
      states.push({ step: i, caption: [`po průchodu i = ${pass}: klíč ${key} na`, ref(step.event.at[0], "pivot")] });
    }
  });
  return states;
}
