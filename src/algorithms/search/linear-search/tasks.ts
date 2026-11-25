import { outcome, type SearchTask } from "@/models/search/tasks";

/* Tasks "find an input such that …" for linear search. */
export const linearSearchTasks: SearchTask[] = [
  {
    id: "first-try",
    text: "Zvol hledanou hodnotu, kterou lineární hledání najde napoprvé.",
    hint: "Lineární hledání začíná vlevo.",
    explain: "Hledaná hodnota je hned na\u00a0začátku pole, stačí jedna kontrola.",
    check: (_, steps) => {
      const { probes, found } = outcome(steps);
      return { done: found && probes === 1, status: `kontroly: ${probes} · cíl 1` };
    },
  },
  {
    id: "every-element",
    text: "Zvol hledanou hodnotu, kvůli které lineární hledání zkontroluje všechny prvky pole.",
    hint: "Kde musí hodnota být — nebo nebýt —, aby se prošlo celé pole?",
    explain: "Hodnota je na\u00a0posledním místě, nebo v\u00a0poli vůbec není: lineární hledání musí projít všech n prvků.",
    check: ({ values }, steps) => {
      const { probes } = outcome(steps);
      return { done: probes === values.length, status: `kontroly: ${probes} · cíl ${values.length}` };
    },
  },
];
