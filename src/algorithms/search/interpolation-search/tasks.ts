import { binaryWorst, outcome, type SearchTask } from "@/models/search/tasks";

/* Tasks "find an input such that …" for interpolation search. */
export const interpolationSearchTasks: SearchTask[] = [
  {
    id: "first-estimate",
    text: "Zvol hledanou hodnotu, kterou interpolační hledání najde na\u00a0první odhad.",
    hint: "Odhad počítá, kde by hodnota ležela, kdyby čísla v\u00a0poli rostla rovnoměrně.",
    explain: "Čísla kolem hledané hodnoty rostou rovnoměrně, takže první odhad trefil přesně.",
    check: (_, steps) => {
      const { probes, found } = outcome(steps);
      return { done: found && probes === 1, status: `kontroly: ${probes} · cíl 1` };
    },
  },
  {
    id: "worse-than-binary",
    text: "Uprav pole tak, aby interpolační hledání potřebovalo víc kontrol, než by kdy potřebovalo binární hledání.",
    hint: "Odhad se plete, když čísla nerostou rovnoměrně — třeba když je na\u00a0konci jedno obrovské číslo.",
    explain:
      "Nerovnoměrná data svádějí odhad stranou a\u00a0interpolační hledání se blíží lineárnímu, O(n). Binárnímu hledání by stačilo ⌊log₂ n⌋ + 1 kontrol.",
    check: ({ values }, steps) => {
      const { probes } = outcome(steps);
      const binary = binaryWorst(values.length);
      return { done: probes > binary, status: `kontroly: ${probes} · cíl víc než ${binary}` };
    },
  },
];
