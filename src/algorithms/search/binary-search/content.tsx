import { Crosshair } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Binary Search page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Binary Search <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Půlení.</span> V&nbsp;seřazeném poli stačí jeden pohled doprostřed: je-li tam menší
      hodnota, než hledáš, celá levá polovina odpadá. Je-li větší, odpadá pravá. Totéž se pak opakuje na&nbsp;tom, co
      zbylo, dokud hodnotu nenajdeš nebo úsek nezmizí.
    </p>
    <p>
      Každý pohled zahodí přibližně polovinu kandidátů. Proto v&nbsp;poli s&nbsp;milionem prvků stačí nejvýš{" "}
      <strong>20 pohledů</strong>.
    </p>

    <div className="inline-viz-row">
      <p style={{ margin: 0 }}>
        Sleduj ukazatele <strong>lo</strong> a&nbsp;<strong>hi</strong>: ohraničují úsek, ve&nbsp;kterém hodnota ještě
        může být. Algoritmus se vždy dívá na&nbsp;jeho střed <strong>mid</strong> a&nbsp;jeden z&nbsp;ukazatelů přesune
        těsně za&nbsp;něj.
      </p>
      <div className="inline-viz" aria-hidden="true">
        <div className="head">
          <span>halve</span>
          <span className="accent">mid</span>
        </div>
        <div className="bars">
          <div className="b" style={{ height: "22%" }} />
          <div className="b" style={{ height: "38%" }} />
          <div className="b up" style={{ height: "55%" }} />
          <div className="b" style={{ height: "72%" }} />
          <div className="b" style={{ height: "90%" }} />
        </div>
        <div className="arrow">lo · mid · hi</div>
      </div>
    </div>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Kdykoli hledáš v&nbsp;<strong>seřazeném</strong> poli. Na&nbsp;neseřazeném dává nesmyslné výsledky: závěr
      „všechno vlevo je menší“ tam neplatí. A&nbsp;potřebuje přímý přístup k&nbsp;prvku podle indexu, takže se nehodí
      na&nbsp;spojový seznam.
    </p>

    <div className="callout">
      <div className="q">Proč lo ≤ hi, a&nbsp;ne lo &lt; hi?</div>
      <p>
        Když je v&nbsp;úseku poslední prvek, platí lo = hi, a&nbsp;i&nbsp;ten je potřeba zkontrolovat. S&nbsp;podmínkou{" "}
        <span className="mono">lo &lt; hi</span> a&nbsp;posunem <span className="mono">hi = mid − 1</span> by některé
        prvky zůstaly nenalezené. Je to jedna z&nbsp;nejčastějších chyb v&nbsp;tomto algoritmu.
      </p>
    </div>

    <p className="pull">„Každý pohled zahodí polovinu toho, co zbývá.“</p>

    <p>
      V&nbsp;přehrávači je zkoumaný střed <span style={{ color: "var(--viz-compared)" }}>žlutý</span>, vyřazené prvky
      jsou ztlumené a&nbsp;čárkovaná čára ukazuje výšku hledané hodnoty. Počítadlo <em>left</em> ukazuje, kolik
      kandidátů zbývá: skoro se půlí.
    </p>
  </>
);

export const binarySearchContent: AlgorithmContent = {
  readMinutes: 4,
  lede: (
    <>
      Podívej se doprostřed a&nbsp;zahoď polovinu. V&nbsp;seřazeném poli najde hodnotu za&nbsp;<em>logaritmický</em>{" "}
      počet kroků.
    </>
  ),
  compareWith: [
    { name: "Linear Search", complexity: "O(n)", href: "#" },
    { name: "Interpolation Search", complexity: "O(log log n)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "nejlepší případ",
      bigO: "O(1)",
      note: <>Hledaná hodnota je hned uprostřed.</>,
      tone: "good",
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(log n)",
      note: <>Každý pohled zhruba půlí počet kandidátů.</>,
      tone: "good",
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(log n)",
      note: <>Nejvýš ⌊log₂&nbsp;n⌋&nbsp;+&nbsp;1 pohledů, i&nbsp;když hodnota v&nbsp;poli není.</>,
      tone: "good",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(1)",
      note: <>Iterativní verze si pamatuje jen lo a&nbsp;hi; rekurzivní potřebuje O(log&nbsp;n) na&nbsp;zásobníku.</>,
      tone: "good",
    },
  ],
  related: ["linear-search", "interpolation-search"],
  next: {
    name: "Interpolation Search",
    group: "search",
    badge: { variant: "search-sorted", icon: Crosshair, label: "int" },
    complexity: "O(log log n)",
    level: "intermediate",
    href: "/algorithms/interpolation-search",
  },
};
