import { ArrowDownToLine } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Selection Sort page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Selection Sort <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Vyber nejmenší, dej ho dopředu.</span> Algoritmus projde celou neseřazenou část a&nbsp;najde
      její minimum. To vymění s&nbsp;prvním prvkem této části — a&nbsp;tím je jedna pozice definitivně hotová. Potom totéž
      zopakuje na&nbsp;zbytku pole, který je o&nbsp;jeden prvek kratší.
    </p>
    <p>
      Na&nbsp;rozdíl od&nbsp;Bubble Sort při&nbsp;hledání minima nic nepřesouvá. Během celého průchodu si jen pamatuje{" "}
      <em>index</em> dosud nejmenšího prvku a&nbsp;vyměňuje až na&nbsp;konci, jednou.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Prakticky jen tehdy, když je zápis do&nbsp;paměti mnohem dražší než porovnání, protože vystačí s&nbsp;n − 1 výměnami.
      Porovnání ale udělá vždy stejně: n(n − 1)/2, ať je pole náhodné, nebo už seřazené. Neumí poznat, že je hotovo —
      a&nbsp;právě v&nbsp;tom prohrává s&nbsp;Insertion Sort i&nbsp;s&nbsp;Bubble Sort, které na&nbsp;seřazeném poli končí
      po&nbsp;jediném průchodu.
    </p>

    <div className="callout">
      <div className="q">Je Selection Sort stabilní?</div>
      <p>
        Není. Výměna může přeskočit stejnou hodnotu: v&nbsp;poli [5, 5, 1] se první pětka vymění s&nbsp;jedničkou
        a&nbsp;ocitne se za&nbsp;druhou pětkou. Když na&nbsp;pořadí stejných prvků záleží, je lepší Insertion Sort nebo
        Merge Sort.
      </p>
    </div>

    <p className="pull">„Po&nbsp;každém průchodu je jedna pozice hotová. Vždy za&nbsp;stejnou cenu.“</p>

    <p>
      V&nbsp;přehrávači je dosavadní minimum <span style={{ color: "var(--viz-pivot)" }}>růžové</span> a&nbsp;právě
      porovnávaný prvek <span style={{ color: "var(--viz-compared)" }}>jantarový</span>. Hotová část{" "}
      <span style={{ color: "var(--viz-sorted)" }}>azurově</span> roste zleva. Tato verze vyměňuje v&nbsp;každém průchodu,
      i&nbsp;když je minimum už na&nbsp;svém místě a&nbsp;mění se samo se sebou; podmínka if min ≠ i by tyto výměny
      ušetřila, ale nic dalšího by nezměnila.
    </p>
  </>
);

export const selectionSortContent: AlgorithmContent = {
  readMinutes: 4,
  lede: (
    <>
      Řazení výběrem. V&nbsp;každém průchodu najde minimum zbytku pole a&nbsp;dá ho na&nbsp;správné místo. Málo výměn,
      ale <em>vždy</em> stejně mnoho porovnání.
    </>
  ),
  compareWith: [
    { name: "Bubble Sort", complexity: "O(n²)", href: "/compare?a=selection-sort&b=bubble-sort" },
    { name: "Insertion Sort", complexity: "O(n²)", href: "/compare?a=selection-sort&b=insertion-sort" },
    { name: "Quick Sort", complexity: "O(n log n)", href: "/compare?a=selection-sort&b=quick-sort" },
    { name: "Merge Sort", complexity: "O(n log n)", href: "/compare?a=selection-sort&b=merge-sort" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "nejlepší případ",
      bigO: "O(n²)",
      note: (
        <>
          I&nbsp;<em>seřazené</em> pole stojí n(n − 1)/2 porovnání: minimum se musí pokaždé hledat celé.
        </>
      ),
      tone: "bad",
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(n²)",
      note: <>Počet porovnání na&nbsp;datech vůbec nezávisí.</>,
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n²)",
      note: <>Stále stejný počet porovnání a&nbsp;nejvýše n − 1 skutečných výměn.</>,
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(1)",
      note: (
        <>
          Třídí <em>in-place</em>, navíc si pamatuje jen index minima.
        </>
      ),
      tone: "good",
    },
  ],
  related: ["bubble-sort", "insertion-sort"],
  next: {
    name: "Insertion Sort",
    group: "sorting",
    badge: { variant: "sorting", icon: ArrowDownToLine, label: "insert" },
    complexity: "O(n²)",
    level: "beginner",
    href: "/algorithms/insertion-sort",
  },
};
