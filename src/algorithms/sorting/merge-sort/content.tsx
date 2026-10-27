import { Search } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
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

/** Size of the input → running time: Merge Sort O(n log n) against Bubble Sort O(n²). */
const complexityChart = (
  <>
    <div className="chart-head">
      <div className="t">velikost pole&nbsp;→&nbsp;čas</div>
      <div className="chart-legend">
        <span className="lg">
          <span className="ln" /> merge sort · O(n log n)
        </span>
        <span className="lg dash">
          <span className="ln" /> bubble · O(n²)
        </span>
      </div>
    </div>
    <svg className="chart-svg" viewBox="0 0 720 240" preserveAspectRatio="none" aria-hidden="true">
      {/* grid */}
      <g stroke="#1f1f23" strokeWidth="1">
        <line x1="0" y1="60" x2="720" y2="60" />
        <line x1="0" y1="120" x2="720" y2="120" />
        <line x1="0" y1="180" x2="720" y2="180" />
      </g>
      {/* axes */}
      <g stroke="#2a2a2f" strokeWidth="1">
        <line x1="0" y1="220" x2="720" y2="220" />
        <line x1="1" y1="20" x2="1" y2="220" />
      </g>
      {/* bubble n^2 (dashed subtle) */}
      <path
        d="M0,219 C150,210 270,188 390,150 C500,116 590,74 690,24"
        fill="none"
        stroke="#71717a"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      {/* merge sort n log n (accent) */}
      <path d="M0,218 C120,206 260,188 400,168 C520,150 620,134 720,120" fill="none" stroke="#a3e635" strokeWidth="2.5" />
      {/* end dots */}
      <circle cx="690" cy="24" r="3" fill="#71717a" />
      <circle cx="720" cy="120" r="3.5" fill="#a3e635" />
    </svg>
    <div className="chart-axis">
      <span>n = 0</span>
      <span>velikost vstupu</span>
      <span>n = 1000</span>
    </div>
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
    { name: "Quick Sort", complexity: "O(n log n)", href: "#" },
    { name: "Heap Sort", complexity: "O(n log n)", href: "#" },
    { name: "Insertion Sort", complexity: "O(n²)", href: "#" },
    { name: "Bubble Sort", complexity: "O(n²)", href: "#" },
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
  complexityChart,
  related: ["quick-sort", "bubble-sort"],
  next: {
    name: "Binary Search",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    complexity: "O(log n)",
    level: "beginner",
    href: "/algorithms",
  },
};
