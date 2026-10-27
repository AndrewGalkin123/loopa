import { Search } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Quick Sort page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Quick Sort <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Rozděl a&nbsp;panuj.</span> Quick Sort si z&nbsp;úseku pole vybere jeden prvek —{" "}
      <em>pivot</em> — a&nbsp;přeskládá ostatní tak, aby všechno menší nebo stejné stálo vlevo od&nbsp;něj
      a&nbsp;všechno větší vpravo. Tím se pivot dostane na&nbsp;své definitivní místo. Pak algoritmus stejným způsobem
      seřadí levou a&nbsp;pravou část, každou zvlášť.
    </p>
    <p>
      Části se už nikdy nemíchají. Každé rozdělení (<em>partition</em>) zmenší problém a&nbsp;po posledním z&nbsp;nich
      je pole seřazené — bez slučování a&nbsp;bez pomocného pole.
    </p>

    <div className="inline-viz-row">
      <p style={{ margin: 0 }}>
        Sleduj index <strong>i</strong>: je to hranice oblasti „menší nebo rovno pivotu“. Index <strong>j</strong>{" "}
        prochází úsek zleva doprava a&nbsp;kdykoli najde prvek, který do&nbsp;této oblasti patří, posune hranici
        o&nbsp;jedno místo a&nbsp;prvek do&nbsp;ní přehodí. Nakonec pivot skočí přesně za&nbsp;hranici.
      </p>
      <div className="inline-viz" aria-hidden="true">
        <div className="head">
          <span>partition</span>
          <span className="accent">pivot</span>
        </div>
        <div className="bars">
          <div className="b" style={{ height: "30%" }} />
          <div className="b" style={{ height: "45%" }} />
          <div className="b up" style={{ height: "55%" }} />
          <div className="b" style={{ height: "72%" }} />
          <div className="b" style={{ height: "88%" }} />
        </div>
        <div className="arrow">≤ pivot · pivot · &gt; pivot</div>
      </div>
    </div>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Prakticky pořád. Quick Sort je v&nbsp;průměru jedno z&nbsp;nejrychlejších porovnávacích třídění: pracuje
      na&nbsp;místě, má malou konstantu a&nbsp;dobře využívá cache procesoru. Proto na&nbsp;něm stojí řazení
      ve&nbsp;standardních knihovnách, například <span className="mono">std::sort</span> v&nbsp;C++ nebo <span className="mono">Arrays.sort</span>{" "}
      pro primitivní typy v&nbsp;Javě (ve&nbsp;vylepšených variantách). Pozor ale na&nbsp;
      <strong>už seřazená data</strong>: s&nbsp;pivotem z&nbsp;posledního prvku se každé rozdělení zvrhne
      na&nbsp;„nic | pivot | všechno ostatní“ a&nbsp;algoritmus spadne na&nbsp;O(n²).
    </p>

    <div className="callout">
      <div className="q">Proč „quick“, když umí být kvadratický?</div>
      <p>
        Nejhorší případ nastává jen při opakovaně nešťastné volbě pivotu. Na&nbsp;náhodných datech je taková smůla
        velmi nepravděpodobná a&nbsp;průměrný počet porovnání je zhruba <em>1,39&nbsp;·&nbsp;n&nbsp;log₂&nbsp;n</em>.
        Stačí volit pivot náhodně nebo jako medián tří prvků a&nbsp;nejhoršímu případu se v&nbsp;praxi vyhneš.
      </p>
    </div>

    <p className="pull">„Dobrý pivot rozdělí pole napůl. Špatný ho jen zkrátí o&nbsp;jeden prvek.“</p>

    <p>
      Po každém rozdělení se pivot obarví <span style={{ color: "var(--viz-sorted)" }}>azurově</span> — na&nbsp;svém
      místě už zůstane. Ztlumené sloupce leží mimo právě zpracovávaný úsek: na&nbsp;ty přijde řada později v&nbsp;rekurzi.
      Zkus v&nbsp;přehrávači data <em>sorted</em> a&nbsp;uvidíš, jak se úseky zmenšují vždy jen o&nbsp;jeden prvek.
    </p>
  </>
);

/** Size of the input → running time: Quick Sort O(n log n) against Bubble Sort O(n²). */
const complexityChart = (
  <>
    <div className="chart-head">
      <div className="t">velikost pole&nbsp;→&nbsp;čas</div>
      <div className="chart-legend">
        <span className="lg">
          <span className="ln" /> quicksort · O(n log n)
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
      {/* quicksort n log n (accent) */}
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

export const quickSortContent: AlgorithmContent = {
  readMinutes: 6,
  lede: (
    <>
      Rozděl a&nbsp;panuj v&nbsp;nejčistší podobě. Vybere pivot, rozdělí kolem něj pole a&nbsp;zbytek nechá
      na&nbsp;rekurzi. V&nbsp;průměru <em>bleskově</em> rychlý — pokud zrovna nemá smůlu na&nbsp;pivot.
    </>
  ),
  compareWith: [
    { name: "Bubble Sort", complexity: "O(n²)", href: "/compare" },
    { name: "Merge Sort", complexity: "O(n log n)", href: "#" },
    { name: "Heap Sort", complexity: "O(n log n)", href: "#" },
    { name: "Insertion Sort", complexity: "O(n²)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "nejlepší případ",
      bigO: "O(n log n)",
      note: <>Pivot pokaždé rozdělí úsek přibližně napůl: log&nbsp;n úrovní rekurze, na&nbsp;každé n porovnání.</>,
      tone: "good",
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(n log n)",
      note: (
        <>
          Náhodné pořadí. Rozdělení nejsou dokonalá, ale v&nbsp;průměru dost vyvážená — zhruba 1,39&nbsp;·&nbsp;n
          log₂&nbsp;n porovnání.
        </>
      ),
      tone: "good",
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n²)",
      note: (
        <>
          Pole <em>už seřazené</em> nebo obrácené — s&nbsp;pivotem z&nbsp;posledního prvku každé rozdělení oddělí jen
          jeden prvek.
        </>
      ),
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(log n)",
      note: (
        <>
          Třídí <em>in-place</em>; paměť spotřebuje jen zásobník rekurze — v&nbsp;průměru O(log&nbsp;n),
          v&nbsp;nejhorším případě O(n).
        </>
      ),
    },
  ],
  complexityChart,
  related: ["bubble-sort", "merge-sort"],
  next: {
    name: "Binary Search",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    complexity: "O(log n)",
    level: "beginner",
    href: "/algorithms",
  },
};
