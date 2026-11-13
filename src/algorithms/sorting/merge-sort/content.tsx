import { Pyramid } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { ComplexityChart, GROWTH } from "@/components/ComplexityChart";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Merge Sort page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Merge Sort <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Rozděl, seřaď, slij.</span> Merge Sort rozpůlí pole, každou polovinu seřadí — stejným
      způsobem, rekurzivně — a&nbsp;nakonec obě seřazené poloviny slije do&nbsp;jedné. Dělení končí u&nbsp;úseků
      o&nbsp;jednom prvku: ty jsou seřazené samy od&nbsp;sebe.
    </p>
    <p>
      Veškerá práce se děje při <em>slévání</em>. Dvě seřazené poloviny se slévají jako dva balíčky karet lícem
      nahoru: porovnáš dvě vrchní karty a&nbsp;menší z&nbsp;nich odložíš na&nbsp;výsledný balíček. Jakmile jeden
      balíček dojde, zbytek druhého jen přiložíš.
    </p>

    <div className="inline-viz-row">
      <p style={{ margin: 0 }}>
        Sleduj dvě porovnávané hodnoty: vždy jde o&nbsp;první dosud nepoužitý prvek levé a&nbsp;pravé poloviny.
        Menší z&nbsp;nich se zapíše na&nbsp;další volné místo a&nbsp;v&nbsp;porovnání ho nahradí jeho soused.
        Každé porovnání tak zapíše jeden prvek, takže slití úseku o&nbsp;m prvcích stojí nejvýš m&nbsp;−&nbsp;1
        porovnání.
      </p>
      <div className="inline-viz" aria-hidden="true">
        <div className="head">
          <span>merge</span>
          <span className="accent">L + R</span>
        </div>
        <div className="bars">
          <div className="b up" style={{ height: "25%" }} />
          <div className="b" style={{ height: "55%" }} />
          <div className="b" style={{ height: "85%" }} />
          <div className="b" style={{ height: "40%" }} />
          <div className="b" style={{ height: "70%" }} />
        </div>
        <div className="arrow">min(L[i], R[j]) → A[k]</div>
      </div>
    </div>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když potřebuješ zaručený čas a&nbsp;stabilitu. Merge Sort má O(n&nbsp;log&nbsp;n) v&nbsp;každém případě —
      nešťastný pivot tu neexistuje — a&nbsp;je <strong>stabilní</strong>: stejné hodnoty si zachovají původní
      pořadí. Hodí se i&nbsp;pro spojové seznamy a&nbsp;pro data, která se nevejdou do&nbsp;paměti (externí třídění).
      Na&nbsp;jeho myšlence stojí Timsort, výchozí řazení v&nbsp;Pythonu, v&nbsp;JavaScriptu (V8) a&nbsp;v&nbsp;Javě
      pro objekty.
    </p>

    <div className="callout">
      <div className="q">Kde je háček?</div>
      <p>
        V&nbsp;paměti. Slévání potřebuje pomocné pole o&nbsp;velikosti slévaného úseku — celkem O(n) navíc. Quick
        Sort třídí na&nbsp;místě, a&nbsp;proto bývá pro pole v&nbsp;praxi o&nbsp;něco rychlejší. Merge Sort zato
        nikdy nespadne na&nbsp;O(n²).
      </p>
    </div>

    <p className="pull">„Seřadit dvě poloviny je snadné. Umění je v&nbsp;tom, jak je slít.“</p>

    <p>
      Přehrávač ukazuje <em>logický</em> stav slévání: vlevo je už slitá část, za&nbsp;ní zbytek levé a&nbsp;pak
      pravé poloviny. Ve&nbsp;skutečné implementaci leží poloviny během slévání v&nbsp;pomocných polích L a&nbsp;R.
      Ztlumené sloupce jsou mimo právě zpracovávaný úsek. Až při posledním slití se prvky barví{" "}
      <span style={{ color: "var(--viz-sorted)" }}>azurově</span> — teprve tehdy je každý na&nbsp;svém definitivním
      místě.
    </p>
  </>
);

export const mergeSortContent: AlgorithmContent = {
  readMinutes: 6,
  lede: (
    <>
      Rozděl pole na&nbsp;poloviny, každou seřaď a&nbsp;pak je slij dohromady. Vždy O(n&nbsp;log&nbsp;n)
      a&nbsp;<em>stabilní</em> — za&nbsp;cenu pomocné paměti.
    </>
  ),
  compareWith: [
    { name: "Quick Sort", complexity: "O(n log n)", href: "/compare?a=merge-sort&b=quick-sort" },
    { name: "Heap Sort", complexity: "O(n log n)", href: "/compare?a=merge-sort&b=heap-sort" },
    { name: "Insertion Sort", complexity: "O(n²)", href: "/compare?a=merge-sort&b=insertion-sort" },
    { name: "Bubble Sort", complexity: "O(n²)", href: "/compare?a=merge-sort&b=bubble-sort" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "nejlepší případ",
      bigO: "O(n log n)",
      note: (
        <>
          I&nbsp;seřazené pole se dělí a&nbsp;slévá úplně stejně — jen porovnání je zhruba polovina, protože levá
          polovina vždy dojde jako první.
        </>
      ),
      tone: "good",
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(n log n)",
      note: <>log₂&nbsp;n úrovní dělení a&nbsp;na&nbsp;každé úrovni se slévá celkem n prvků.</>,
      tone: "good",
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n log n)",
      note: <>Nejhorší vstup neexistuje — pole se dělí vždy napůl, ať jsou data jakákoli.</>,
      tone: "good",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(n)",
      note: (
        <>
          Pomocná pole pro slévání. To je hlavní nevýhoda oproti Quick Sortu, který třídí <em>in-place</em>.
        </>
      ),
      tone: "bad",
    },
  ],
  complexityChart: (
    <ComplexityChart
      title="velikost pole&nbsp;→&nbsp;čas"
      axis="velikost vstupu n · bez konstant"
      curves={[
        { label: "merge sort · O(n log n)", grows: GROWTH.nLogN },
        { label: "bubble · O(n²)", grows: GROWTH.n2, style: "dash" },
      ]}
    />
  ),
  related: ["quick-sort", "bubble-sort"],
  next: {
    name: "Heap Sort",
    group: "sorting",
    badge: { variant: "sorting", icon: Pyramid, label: "heap" },
    complexity: "O(n log n)",
    level: "intermediate",
    href: "/algorithms/heap-sort",
  },
};
