import { reach } from "@/core/tasks";
import { ofLength, type ArrayTask } from "@/models/array/tasks";

const shifts = (steps: { counters: Record<string, number> }[]) => steps[steps.length - 1].counters.shf;

/* Tasks "find an input such that …" for Insertion Sort. */
export const insertionSortTasks: ArrayTask[] = [
  {
    id: "no-shift",
    text: "Najdi pole délky 6, na kterém neproběhne žádný posun.",
    hint: "Posun nastane, když je prvek vlevo od klíče větší než klíč.",
    explain: "Seřazené pole: každý klíč je větší než jeho levý soused, nic se neposune a\u00a0stačí 5 porovnání.",
    check: (values, steps) => ofLength(values, 6, () => reach("posuny", shifts(steps), 0)),
  },
  {
    id: "five-shifts",
    text: "Najdi pole délky 6 s\u00a0přesně 5 posuny.",
    hint: "Posunů je přesně tolik, kolik je v\u00a0poli dvojic v\u00a0obráceném pořadí.",
    explain: "Pole má 5 dvojic v\u00a0obráceném pořadí (inverzí) a\u00a0každá stojí jeden posun.",
    check: (values, steps) => ofLength(values, 6, () => reach("posuny", shifts(steps), 5)),
  },
  {
    id: "most-shifts",
    text: "Najdi pole délky 6, na kterém proběhne nejvíc posunů.",
    hint: "Každý klíč by musel dojít až na\u00a0začátek pole.",
    explain: "Sestupně seřazené pole: klíč na\u00a0indexu i\u00a0se posune přes všech i\u00a0prvků před ním, celkem 1 + 2 + … + 5 = 15.",
    check: (values, steps) => ofLength(values, 6, () => reach("posuny", shifts(steps), 15)),
  },
];
