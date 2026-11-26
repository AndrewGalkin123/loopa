import { reach } from "@/core/tasks";
import { ofLength, type ArrayTask } from "@/models/array/tasks";

const last = (steps: { counters: Record<string, number> }[]) => steps[steps.length - 1].counters;

/* Tasks "find an input such that …" for Bubble Sort. */
export const bubbleSortTasks: ArrayTask[] = [
  {
    id: "one-pass",
    text: { cs: "Najdi pole délky 8, na kterém Bubble Sort skončí po jediném průchodu.", en: "Find an array of length 8 on which Bubble Sort stops after a single pass." },
    hint: { cs: "Bubble Sort končí, když v průchodu nic nevymění. Kdy se to stane hned napoprvé?", en: "Bubble Sort stops when a pass swaps nothing. When does that happen on the very first pass?" },
    explain: {
      cs: "Pole je už seřazené: první průchod nic nevymění, a tak algoritmus skončí po 7 porovnáních.",
      en: "The array is already sorted: the first pass swaps nothing, so the algorithm stops after 7 comparisons.",
    },
    check: (values, steps) =>
      ofLength(values, 8, () => reach({ cs: "průchody", en: "passes" }, steps.filter((s) => s.event.type === "phase" && s.event.name === "pass").length, 1)),
  },
  {
    id: "most-swaps",
    text: { cs: "Najdi pole délky 8, na kterém udělá nejvíc výměn.", en: "Find an array of length 8 on which it makes the most swaps." },
    hint: {
      cs: "Každá výměna opraví jednu dvojici čísel v obráceném pořadí. Kolik takových dvojic může mít pole délky 8?",
      en: "Every swap fixes one pair of numbers in the wrong order. How many such pairs can an array of length 8 have?",
    },
    explain: {
      cs: "Sestupně seřazené pole: všech 28 dvojic je v obráceném pořadí a každá potřebuje jednu výměnu.",
      en: "An array sorted in descending order: all 28 pairs are in the wrong order and each needs one swap.",
    },
    check: (values, steps) => ofLength(values, 8, () => reach({ cs: "výměny", en: "swaps" }, last(steps).swp, 28)),
  },
  {
    id: "one-swap",
    text: { cs: "Najdi pole délky 8 s přesně jednou výměnou.", en: "Find an array of length 8 with exactly one swap." },
    hint: { cs: "Stačí jediná dvojice sousedů ve špatném pořadí.", en: "A single pair of neighbours in the wrong order is enough." },
    explain: {
      cs: "Výměn je přesně tolik, kolik je v poli dvojic v obráceném pořadí (inverzí) — tady jediná.",
      en: "There are exactly as many swaps as pairs in the wrong order (inversions) — here just one.",
    },
    check: (values, steps) => ofLength(values, 8, () => reach({ cs: "výměny", en: "swaps" }, last(steps).swp, 1)),
  },
];
