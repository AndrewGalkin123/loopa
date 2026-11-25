import { binaryWorst, outcome, type SearchTask } from "@/models/search/tasks";

/* Tasks "find an input such that …" for binary search. */
export const binarySearchTasks: SearchTask[] = [
  {
    id: "first-try",
    text: "Zvol hledanou hodnotu, kterou binární hledání najde na\u00a0první pokus.",
    hint: "Binární hledání se nejdřív podívá doprostřed pole.",
    explain: "Hodnota je přesně uprostřed, takže ji najde hned první kontrola.",
    check: (_, steps) => {
      const { probes, found } = outcome(steps);
      return { done: found && probes === 1, status: `kontroly: ${probes} · cíl 1` };
    },
  },
  {
    id: "most-tries",
    text: "Zvol hledanou hodnotu, na\u00a0kterou binární hledání potřebuje nejvíc kontrol.",
    hint: "Zkus hodnoty u\u00a0okrajů pole, nebo hodnotu, která v\u00a0poli není.",
    explain: "Každá kontrola půlí úsek, a\u00a0tak ani nejhorší případ nepotřebuje víc než ⌊log₂ n⌋ + 1 kontrol.",
    check: ({ values }, steps) => {
      const { probes } = outcome(steps);
      const worst = binaryWorst(values.length);
      return { done: probes === worst, status: `kontroly: ${probes} · cíl ${worst}` };
    },
  },
];
