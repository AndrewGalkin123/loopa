import { reach } from "@/core/tasks";
import { ofLength, type ArrayTask } from "@/models/array/tasks";

const comparisons = (steps: { counters: Record<string, number> }[]) => steps[steps.length - 1].counters.cmp;

/* Tasks "find an input such that …" for Quick Sort (Lomuto, the pivot is the last element). */
export const quickSortTasks: ArrayTask[] = [
  {
    id: "most-comparisons",
    text: "Najdi pole délky 8, na kterém Quick Sort udělá nejvíc porovnání.",
    hint: "Nejhorší je pivot, který je pokaždé největší, nebo nejmenší číslo svého úseku.",
    explain:
      "Pivot je pokaždé krajní, takže se úsek zkrátí jen o\u00a0jeden prvek: 7 + 6 + … + 1 = 28 porovnání. Tak dopadne třeba už seřazené pole.",
    check: (values, steps) => ofLength(values, 8, () => reach("porovnání", comparisons(steps), 28)),
  },
  {
    id: "fewest-comparisons",
    text: "Najdi pole délky 8, na kterém Quick Sort udělá nejméně porovnání.",
    hint: "Nejlepší pivot rozdělí svůj úsek na\u00a0dvě stejně velké části — a\u00a0to v\u00a0každém dělení.",
    explain: "Pivoty dělí úseky skoro napůl, takže se rychle zmenšují. Méně než 13 porovnání na\u00a08 číslech nejde.",
    check: (values, steps) => ofLength(values, 8, () => reach("porovnání", comparisons(steps), 13)),
  },
  {
    id: "pivot-in-middle",
    text: "Najdi pole délky 8, ve kterém první pivot skončí uprostřed (na\u00a0indexu 3, nebo 4).",
    hint: "Pivot je poslední prvek pole. Kolik čísel menších než on musí stát před ním?",
    explain: "Před pivot se dostanou přesně čísla ≤ pivot. Když je pivot prostřední hodnota, rozdělí pole na\u00a0dvě poloviny.",
    check: (values, steps) =>
      ofLength(values, 8, () => {
        const first = steps.find((s) => s.event.type === "settle" && s.line === 14);
        const place = first?.event.type === "settle" ? first.event.at : -1;
        return { done: place === 3 || place === 4, status: `první pivot: na\u00a0[${place}] · cíl [3] nebo [4]` };
      }),
  },
];
