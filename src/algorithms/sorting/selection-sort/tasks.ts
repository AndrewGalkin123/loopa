import { reach, unreachable } from "@/core/tasks";
import { ofLength, type ArrayTask } from "@/models/array/tasks";
import type { ArrayStep } from "@/models/array/types";

/** How many times the minimum changes in the first pass. */
function firstPassChanges(steps: ArrayStep[]) {
  const end = steps.findIndex((s) => s.event.type === "settle");
  return steps.slice(0, end).filter((s) => s.event.type === "phase" && s.event.name === "minimum").length;
}

/** Did a swap carry a value over an equal one (so two equal values changed their order)? */
function jumpsOverEqual(steps: ArrayStep[]) {
  return steps.some((step, k) => {
    if (step.event.type !== "swap" || step.event.i === step.event.j) return false;
    const before = steps[k - 1].state.values;
    const { i, j } = step.event;
    return before.slice(i + 1, j).includes(before[i]);
  });
}

/* Tasks "find an input such that …" for Selection Sort. */
export const selectionSortTasks: ArrayTask[] = [
  {
    id: "minimum-stays",
    text: "Najdi pole délky 8, na kterém se v\u00a0prvním průchodu minimum ani jednou nezmění.",
    hint: "Minimum se změní, když se najde číslo menší než dosavadní minimum. Které číslo musí stát na\u00a0začátku?",
    explain: "Na\u00a0začátku stojí nejmenší číslo pole, takže ho žádné další nepřebije.",
    check: (values, steps) => ofLength(values, 8, () => reach("změny minima", firstPassChanges(steps), 0)),
  },
  {
    id: "minimum-changes",
    text: "Najdi pole délky 8, na kterém se v\u00a0prvním průchodu minimum změní sedmkrát.",
    hint: "Každé další číslo musí být menší než všechna před ním.",
    explain: "Sestupně seřazené pole: každé další číslo je nové minimum, a tak se změní sedmkrát.",
    check: (values, steps) => ofLength(values, 8, () => reach("změny minima", firstPassChanges(steps), 7)),
  },
  {
    id: "unstable",
    text: "Najdi pole, na kterém Selection Sort prohodí pořadí dvou stejných čísel.",
    hint: "Dej na\u00a0začátek dvě stejná čísla a\u00a0za ně menší číslo.",
    explain:
      "Výměna přenesla první ze dvou stejných čísel až za to druhé, takže se jejich pořadí otočilo. Proto Selection Sort není stabilní.",
    check: (_, steps) => ({ done: jumpsOverEqual(steps) }),
  },
  {
    id: "fewer-comparisons",
    impossible: true,
    text: "Zkus najít pole délky 8, na kterém Selection Sort udělá méně než 28 porovnání.",
    hint: "Kolikrát se porovnává v\u00a0prvním průchodu? A\u00a0záleží to vůbec na\u00a0datech?",
    explain:
      "Nejde to: v\u00a0každém průchodu se minimum porovná se všemi zbývajícími prvky, celkem 7 + 6 + … + 1 = 28, ať jsou data jakákoli.",
    check: (values, steps) => ofLength(values, 8, () => unreachable("porovnání", steps[steps.length - 1].counters.cmp)),
  },
];
