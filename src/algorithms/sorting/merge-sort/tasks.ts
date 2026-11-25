import { reach, unreachable } from "@/core/tasks";
import { ofLength, type ArrayTask } from "@/models/array/tasks";

const last = (steps: { counters: Record<string, number> }[]) => steps[steps.length - 1].counters;

/* Tasks "find an input such that …" for Merge Sort. */
export const mergeSortTasks: ArrayTask[] = [
  {
    id: "fewest-comparisons",
    text: "Najdi pole délky 8, na kterém Merge Sort udělá nejméně porovnání.",
    hint: "Při slévání se porovnává, dokud jedna polovina nedojde. Kdy dojde co nejdřív?",
    explain:
      "V\u00a0každém slévání je jedna polovina celá menší než druhá (třeba u\u00a0seřazeného pole), a\u00a0tak skončí, jakmile se vyčerpá: 4 + 4 + 4 = 12 porovnání.",
    check: (values, steps) => ofLength(values, 8, () => reach("porovnání", last(steps).cmp, 12)),
  },
  {
    id: "most-comparisons",
    text: "Najdi pole délky 8, na kterém Merge Sort udělá nejvíc porovnání.",
    hint: "Ať se při každém slévání čísla z\u00a0obou polovin střídají až do\u00a0konce.",
    explain: "Čísla obou polovin se střídají, takže se porovnává až do\u00a0posledního prvku: 4 · 1 + 2 · 3 + 1 · 7 = 17 porovnání.",
    check: (values, steps) => ofLength(values, 8, () => reach("porovnání", last(steps).cmp, 17)),
  },
  {
    id: "other-writes",
    impossible: true,
    text: "Zkus najít pole délky 8, na kterém Merge Sort udělá jiný počet zápisů než 24.",
    hint: "Kolik prvků zapíše zpět jedno slévání? A\u00a0kolik je úrovní dělení?",
    explain:
      "Nejde to: každé slévání zapíše zpět všechny prvky svého úseku, na\u00a0každé ze 3 úrovní je to všech 8 prvků. Vždy tedy 3 · 8 = 24 zápisů.",
    check: (values, steps) => ofLength(values, 8, () => unreachable("zápisy", last(steps).wrt)),
  },
];
