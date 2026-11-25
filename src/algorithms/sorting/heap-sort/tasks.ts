import { reach } from "@/core/tasks";
import { ofLength, type ArrayTask } from "@/models/array/tasks";
import type { ArrayStep } from "@/models/array/types";

/** Swaps made while building the max-heap (up to the step of line 5). */
const buildSwaps = (steps: ArrayStep[]) => steps.find((s) => s.line === 5)!.counters.swp;

/* Tasks "find an input such that …" for Heap Sort. */
export const heapSortTasks: ArrayTask[] = [
  {
    id: "already-heap",
    text: "Najdi pole délky 8, které už je max-halda: stavba haldy neudělá žádnou výměnu.",
    hint: "Výměna nastane, když je rodič [i] menší než některé z\u00a0jeho dětí [2i+1] a\u00a0[2i+2].",
    explain: "Každý rodič je větší než jeho děti (třeba u\u00a0sestupně seřazeného pole), takže pole už haldou je a\u00a0stavba nic nemění.",
    check: (values, steps) => ofLength(values, 8, () => reach("výměny při stavbě", buildSwaps(steps), 0)),
  },
  {
    id: "most-build-swaps",
    text: "Najdi pole délky 8, na kterém stavba haldy udělá nejvíc výměn.",
    hint: "Malá čísla v\u00a0horní části stromu musí propadnout co nejhlouběji.",
    explain: "Malé hodnoty v\u00a0horních patrech stromu se musí prosít až dolů. U\u00a08 prvků je to nejvýš 7 výměn.",
    check: (values, steps) => ofLength(values, 8, () => reach("výměny při stavbě", buildSwaps(steps), 7)),
  },
];
