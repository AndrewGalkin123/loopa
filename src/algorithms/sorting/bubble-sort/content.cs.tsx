import { Crosshair } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { ComplexityChart, GROWTH } from "@/components/ComplexityChart";
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

export const bubbleSortContent: AlgorithmContent = {
  readMinutes: 5,
  lede: (
    <>
      Nejjednodušší řadicí algoritmus založený na&nbsp;porovnání. Pomalý v&nbsp;praxi, ale <em>dokonalý</em> pro
      pochopení, jak třídění vůbec funguje.
    </>
  ),
  compareWith: [
    { name: "Quick Sort", complexity: "O(n log n)", href: "/compare?a=bubble-sort&b=quick-sort" },
    { name: "Merge Sort", complexity: "O(n log n)", href: "/compare?a=bubble-sort&b=merge-sort" },
    { name: "Selection Sort", complexity: "O(n²)", href: "/compare?a=bubble-sort&b=selection-sort" },
    { name: "Insertion Sort", complexity: "O(n²)", href: "/compare?a=bubble-sort&b=insertion-sort" },
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
  complexityChart: (
    <ComplexityChart
      title="velikost pole&nbsp;→&nbsp;čas"
      axis="velikost vstupu n · bez konstant"
      curves={[
        { label: "bubble · O(n²)", grows: GROWTH.n2 },
        { label: "quicksort · O(n log n)", grows: GROWTH.nLogN, style: "dash" },
      ]}
    />
  ),
  related: ["quick-sort", "merge-sort"],
  next: {
    name: "Selection Sort",
    group: "sorting",
    badge: { variant: "sorting", icon: Crosshair, label: "select" },
    complexity: "O(n²)",
    level: "beginner",
    href: "/algorithms/selection-sort",
  },
};
