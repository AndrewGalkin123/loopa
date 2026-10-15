import { ArrowUpNarrowWide } from "lucide-react";
import { MERGE_SORT, QUICK_SORT } from "@/lib/catalog";
import type { AlgorithmContent } from "../types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Bubble Sort page shows besides the player (texts from design/Bubble Sort.html). */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Bubble Sort <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Představ si</span>, že třídíš balíček karet. Bubble Sort pracuje jako ten nejpomalejší
      možný člověk — porovnává vždy jen dvě <em>sousední</em> karty, a&nbsp;pokud jsou ve&nbsp;špatném pořadí, prohodí
      je. Pak postoupí o&nbsp;jedno místo dál a&nbsp;udělá totéž.
    </p>
    <p>
      Algoritmus prochází polem znovu a&nbsp;znovu, dokud neudělá celý průchod bez jediné výměny. Největší prvek
      pokaždé „probublá&quot; až nahoru jako vzduchová bublina — odtud to jméno.
    </p>

    <div className="inline-viz-row">
      <p style={{ margin: 0 }}>
        Sleduj jednu hodnotu během prvního průchodu. Vždy, když je větší než její soused vpravo, prohodí se s&nbsp;ním
        — a&nbsp;putuje stále dál, dokud nenarazí na&nbsp;ještě většího souseda nebo na&nbsp;konec pole.
      </p>
      <div className="inline-viz" aria-hidden="true">
        <div className="head">
          <span>bubble&nbsp;up</span>
          <span className="accent">pass 1</span>
        </div>
        <div className="bars">
          <div className="b" style={{ height: "30%" }} />
          <div className="b" style={{ height: "48%" }} />
          <div className="b up" style={{ height: "88%" }} />
          <div className="b" style={{ height: "62%" }} />
          <div className="b" style={{ height: "40%" }} />
        </div>
        <div className="arrow">[2] → swap → [3] →</div>
      </div>
    </div>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Nikdy v&nbsp;produkci. Vážně. Pro pole o&nbsp;tisíci prvcích provede řádově milion operací tam, kde si Quicksort
      vystačí s&nbsp;deseti tisíci. Existuje ale jedna výjimka, kde má smysl: <strong>téměř seřazená data</strong>{" "}
      s&nbsp;optimalizací předčasného ukončení, kdy doběhne v&nbsp;lineárním čase.
    </p>

    <div className="callout">
      <div className="q">Zachovat na production? Nikdy. Ale proč ho tedy učit?</div>
      <p>
        Bubble Sort se učí, protože je to <em>ideální výchozí bod</em> pro pochopení toho, jak třídění vůbec funguje —
        invariant „po&nbsp;k&nbsp;průchodech je&nbsp;k&nbsp;největších prvků na&nbsp;svém místě&quot; je tu vidět
        doslova očima. Až ho pochopíš, Quicksort i&nbsp;Merge Sort dají mnohem větší smysl.
      </p>
    </div>

    <p className="pull">„Největší prvek vždy vyplave nahoru. Otázka není jestli, ale za&nbsp;kolik porovnání.&quot;</p>

    <p>
      V&nbsp;každém dalším průchodu se horní hranice posune o&nbsp;jedno místo dolů — poslední pozice je už definitivně
      seřazená, takže ji není potřeba znovu kontrolovat. Právě to vidíš výše jako rostoucí{" "}
      <span style={{ color: "var(--viz-sorted)" }}>azurovou</span> oblast zprava.
    </p>
  </>
);

/** Size of the input → running time: Bubble Sort O(n²) against Quicksort O(n log n). */
const complexityChart = (
  <>
    <div className="chart-head">
      <div className="t">velikost pole&nbsp;→&nbsp;čas</div>
      <div className="chart-legend">
        <span className="lg">
          <span className="ln" /> bubble · O(n²)
        </span>
        <span className="lg dash">
          <span className="ln" /> quicksort · O(n log n)
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
      {/* quicksort n log n (dashed subtle) */}
      <path
        d="M0,218 C120,206 260,188 400,168 C520,150 620,134 720,120"
        fill="none"
        stroke="#71717a"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      {/* bubble n^2 (accent) */}
      <path d="M0,219 C150,210 270,188 390,150 C500,116 590,74 690,24" fill="none" stroke="#a3e635" strokeWidth="2.5" />
      {/* end dots */}
      <circle cx="690" cy="24" r="3.5" fill="#a3e635" />
      <circle cx="720" cy="120" r="3" fill="#71717a" />
    </svg>
    <div className="chart-axis">
      <span>n = 0</span>
      <span>velikost vstupu</span>
      <span>n = 1000</span>
    </div>
  </>
);

export const bubbleSort: AlgorithmContent = {
  slug: "bubble-sort",
  name: "Bubble Sort",
  group: "sorting",
  badge: { variant: "sorting", icon: ArrowUpNarrowWide, label: "sort" },
  complexity: "O(n²)",
  level: "beginner",
  readMinutes: 5,
  lede: (
    <>
      Nejjednodušší řadicí algoritmus založený na&nbsp;porovnání. Pomalý v&nbsp;praxi, ale <em>dokonalý</em> pro
      pochopení, jak třídění vůbec funguje.
    </>
  ),
  // The bars of the design: a shuffled 1..15.
  initialInput: [4, 7, 2, 11, 9, 14, 6, 12, 3, 15, 1, 8, 13, 5, 10],
  legend: ["default", "active", "compared", "sorted"],
  datasetHints: { sorted: "nejlepší případ", reversed: "nejhorší případ" },
  compareWith: [
    { name: "Quick Sort", complexity: "O(n log n)", href: "/compare" },
    { name: "Merge Sort", complexity: "O(n log n)", href: "#" },
    { name: "Selection Sort", complexity: "O(n²)", href: "#" },
    { name: "Insertion Sort", complexity: "O(n²)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "nejlepší případ",
      bigO: "O(n)",
      note: (
        <>
          Když je pole <em>již seřazené</em> — jediný průchod bez výměny a&nbsp;algoritmus končí.
        </>
      ),
      tone: "good",
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(n²)",
      note: <>Náhodné pořadí. Počet porovnání roste s&nbsp;druhou mocninou velikosti vstupu.</>,
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n²)",
      note: (
        <>
          Pole seřazené <em>sestupně</em> — každý prvek musí probublat přes celé pole.
        </>
      ),
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(1)",
      note: (
        <>
          Třídí <em>in-place</em>, výměny probíhají přímo v&nbsp;poli. Žádná pomocná struktura.
        </>
      ),
      tone: "good",
    },
  ],
  complexityChart,
  related: [QUICK_SORT, MERGE_SORT],
  next: {
    name: "Selection Sort",
    group: "sorting",
    badge: { variant: "sorting", icon: ArrowUpNarrowWide, label: "sort" },
    complexity: "O(n²)",
    level: "beginner",
    href: "/algorithms",
  },
};
