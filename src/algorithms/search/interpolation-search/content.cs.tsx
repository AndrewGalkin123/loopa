import { GitBranch } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { ComplexityChart, GROWTH } from "@/components/ComplexityChart";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Interpolation Search page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Interpolation Search <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Jako telefonní seznam.</span> Když hledáš jméno na&nbsp;„Z“, neotevřeš seznam uprostřed,
      ale skoro na&nbsp;konci. Interpolační vyhledávání dělá totéž: místo středu se podívá tam, kde by hodnota měla
      ležet, kdyby hodnoty mezi A[lo] a&nbsp;A[hi] rostly rovnoměrně.
    </p>
    <p>
      Odhad je obyčejná úměra: hledaná hodnota leží v&nbsp;určitém poměru mezi krajními hodnotami, a&nbsp;ve&nbsp;stejném
      poměru se vezme pozice mezi lo a&nbsp;hi. Zbytek je stejný jako u&nbsp;binárního vyhledávání.
    </p>

    <div className="inline-viz-row">
      <p style={{ margin: 0 }}>
        V&nbsp;přehrávači je tento odhad vidět: <span style={{ color: "var(--color-accent)" }}>limetková přímka</span>{" "}
        spojuje vrcholy A[lo] a&nbsp;A[hi]. Tam, kde protne čárkovanou čáru hledané hodnoty, leží odhadovaná pozice pos.
      </p>
      <div className="inline-viz" aria-hidden="true">
        <div className="head">
          <span>estimate</span>
          <span className="accent">pos</span>
        </div>
        <div className="bars">
          <div className="b" style={{ height: "18%" }} />
          <div className="b" style={{ height: "36%" }} />
          <div className="b" style={{ height: "54%" }} />
          <div className="b up" style={{ height: "72%" }} />
          <div className="b" style={{ height: "90%" }} />
        </div>
        <div className="arrow">x blízko A[hi] → pos vpravo</div>
      </div>
    </div>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když jsou hodnoty seřazené a&nbsp;<strong>rozložené zhruba rovnoměrně</strong>, například identifikátory
      přidělované po&nbsp;sobě. Na&nbsp;takových datech stačí v&nbsp;průměru O(log&nbsp;log&nbsp;n) pohledů. Na&nbsp;datech
      s&nbsp;nerovnoměrným rozložením bývá horší než binární vyhledávání, a&nbsp;proto se v&nbsp;praxi používá méně.
    </p>

    <div className="callout">
      <div className="q">Proč může spadnout až na&nbsp;O(n)?</div>
      <p>
        Když je rozložení šikmé, přímka mezi A[lo] a&nbsp;A[hi] realitu nevystihuje a&nbsp;odhad padá stále blízko
        jednoho kraje. Každý pohled pak vyřadí jen pár prvků. Zkus v&nbsp;přehrávači data <em>skewed</em> a&nbsp;porovnej
        počet pohledů s&nbsp;daty <em>uniform</em>, kde často stačí jediný.
      </p>
    </div>

    <p className="pull">„Nehádá střed. Hádá, kde to bude.“</p>

    <p>
      Pozor na&nbsp;dvě pasti v&nbsp;kódu: vzorec dělí rozdílem A[hi]&nbsp;−&nbsp;A[lo], takže je potřeba ošetřit shodné
      krajní hodnoty, a&nbsp;smyčka musí hlídat, že x leží mezi nimi, jinak by odhad vyšel mimo pole.
    </p>
  </>
);

export const interpolationSearchContent: AlgorithmContent = {
  readMinutes: 5,
  lede: (
    <>
      Nedívá se doprostřed, ale tam, kde hodnota podle odhadu leží. Na&nbsp;rovnoměrných datech{" "}
      <em>rychlejší</em> než půlení, na&nbsp;nerovnoměrných se může propadnout až k&nbsp;lineárnímu průchodu.
    </>
  ),
  compareWith: [
    { name: "Binary Search", complexity: "O(log n)", href: "#" },
    { name: "Linear Search", complexity: "O(n)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "nejlepší případ",
      bigO: "O(1)",
      note: <>První odhad trefí hodnotu. Na&nbsp;dokonale rovnoměrných datech se to stává pravidelně.</>,
      tone: "good",
    },
    {
      label: "Average case",
      sub: "rovnoměrná data",
      bigO: "O(log log n)",
      note: <>Platí pro rovnoměrně rozložené hodnoty; u&nbsp;jiných rozložení tento odhad neplatí.</>,
      tone: "good",
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n)",
      note: <>Šikmé rozložení: odhad se drží u&nbsp;jednoho kraje a&nbsp;každý pohled vyřadí jen málo prvků.</>,
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(1)",
      note: <>Stačí si pamatovat lo a&nbsp;hi.</>,
      tone: "good",
    },
  ],
  complexityChart: (
    <ComplexityChart
      title="velikost pole&nbsp;→&nbsp;počet kroků"
      axis="velikost vstupu n · bez konstant"
      curves={[
        { label: "rovnoměrná data · O(log log n)", grows: GROWTH.logLogN },
        { label: "binární · O(log n)", grows: GROWTH.logN, style: "dash" },
        { label: "nejhorší případ · O(n)", grows: GROWTH.n, style: "dot" },
      ]}
    />
  ),
  related: ["binary-search", "linear-search"],
  next: {
    name: "BFS",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitBranch, label: "bfs" },
    complexity: "O(V + E)",
    level: "intermediate",
    href: "/algorithms/bfs",
  },
};
