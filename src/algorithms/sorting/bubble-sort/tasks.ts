import { reach } from "@/core/tasks";
import { ofLength, type ArrayTask } from "@/models/array/tasks";

const last = (steps: { counters: Record<string, number> }[]) => steps[steps.length - 1].counters;

/* Tasks "find an input such that …" for Bubble Sort. */
export const bubbleSortTasks: ArrayTask[] = [
  {
    id: "one-pass",
    text: "Najdi pole délky 8, na kterém Bubble Sort skončí po jediném průchodu.",
    hint: "Bubble Sort končí, když v průchodu nic nevymění. Kdy se to stane hned napoprvé?",
    explain: "Pole je už seřazené: první průchod nic nevymění, a tak algoritmus skončí po 7 porovnáních.",
    check: (values, steps) =>
      ofLength(values, 8, () => reach("průchody", steps.filter((s) => s.event.type === "phase" && s.event.name === "pass").length, 1)),
  },
  {
    id: "most-swaps",
    text: "Najdi pole délky 8, na kterém udělá nejvíc výměn.",
    hint: "Každá výměna opraví jednu dvojici čísel v obráceném pořadí. Kolik takových dvojic může mít pole délky 8?",
    explain: "Sestupně seřazené pole: všech 28 dvojic je v obráceném pořadí a každá potřebuje jednu výměnu.",
    check: (values, steps) => ofLength(values, 8, () => reach("výměny", last(steps).swp, 28)),
  },
  {
    id: "one-swap",
    text: "Najdi pole délky 8 s přesně jednou výměnou.",
    hint: "Stačí jediná dvojice sousedů ve špatném pořadí.",
    explain: "Výměn je přesně tolik, kolik je v poli dvojic v obráceném pořadí (inverzí) — tady jediná.",
    check: (values, steps) => ofLength(values, 8, () => reach("výměny", last(steps).swp, 1)),
  },
];
