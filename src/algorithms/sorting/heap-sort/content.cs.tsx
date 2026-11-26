import { Search } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { ComplexityChart, GROWTH } from "@/components/ComplexityChart";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Heap Sort page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Heap Sort <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Halda je strom schovaný v&nbsp;poli.</span> Prvek [0] je kořen a&nbsp;děti prvku [i] leží
      na&nbsp;pozicích [2i+1] a&nbsp;[2i+2]. V&nbsp;<em>max-haldě</em> platí, že žádný rodič není menší než jeho děti —
      a&nbsp;proto je největší prvek vždy v&nbsp;kořeni.
    </p>
    <p>
      Algoritmus má dvě fáze. Nejdřív z&nbsp;pole postaví max-haldu: prochází rodiče odspodu nahoru a&nbsp;každého{" "}
      <em>prosívá dolů</em> — vyměňuje ho s&nbsp;větším z&nbsp;dětí, dokud není větší než obě. Potom opakovaně vymění kořen
      s&nbsp;posledním prvkem haldy, tím maximum odloží na&nbsp;konec pole, haldu zkrátí o&nbsp;jeden prvek a&nbsp;nový
      kořen znovu prosije dolů.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když potřebuješ záruku O(n&nbsp;log&nbsp;n) i&nbsp;v&nbsp;nejhorším případě a&nbsp;nemáš paměť navíc. Quick Sort může
      na&nbsp;nevhodných datech spadnout do&nbsp;O(n²), Merge Sort potřebuje pomocné pole — Heap Sort ani jedno. V&nbsp;praxi
      bývá pomalejší než Quick Sort, protože skáče po&nbsp;poli a&nbsp;špatně využívá cache. Proto ho knihovny používají
      jako pojistku: introsort v&nbsp;C++ přepne z&nbsp;Quick Sortu na&nbsp;Heap Sort, když je rekurze příliš hluboká.
    </p>

    <div className="callout">
      <div className="q">Co má Heap Sort společného se Selection Sort?</div>
      <p>
        Skoro všechno. Oba opakovaně vybírají extrém zbytku pole a&nbsp;odkládají ho na&nbsp;okraj. Selection Sort ho ale
        hledá lineárně, za&nbsp;O(n), kdežto halda ho má připravený v&nbsp;kořeni a&nbsp;oprava po&nbsp;odebrání stojí jen
        O(log&nbsp;n) — výška stromu. Z&nbsp;n² se tak stane n&nbsp;log&nbsp;n. Stabilní ale není ani jeden.
      </p>
    </div>

    <p className="pull">„Maximum je vždy nahoře. Stačí ho jen n-krát sundat.“</p>

    <p>
      V&nbsp;přehrávači je prvek, který se právě prosívá, <span style={{ color: "var(--viz-pivot)" }}>růžový</span>,
      porovnávaný rodič a&nbsp;dítě <span style={{ color: "var(--viz-compared)" }}>jantaroví</span> a&nbsp;výměna{" "}
      <span style={{ color: "var(--viz-active)" }}>limetková</span>. Hotová část{" "}
      <span style={{ color: "var(--viz-sorted)" }}>azurově</span> roste zprava. Strom se nekreslí — sleduj indexy
      ve&nbsp;stavovém řádku: dítě prvku [i] je vždy [2i+1] nebo [2i+2].
    </p>
  </>
);

export const heapSortContent: AlgorithmContent = {
  readMinutes: 6,
  lede: (
    <>
      Řazení haldou. Z&nbsp;pole postaví max-haldu a&nbsp;pak z&nbsp;ní n-krát odebere maximum. Vždy O(n&nbsp;log&nbsp;n),
      bez pomocné paměti — <em>Selection Sort s&nbsp;chytřejším hledáním</em>.
    </>
  ),
  compareWith: [
    { name: "Quick Sort", complexity: "O(n log n)", href: "/compare?a=heap-sort&b=quick-sort" },
    { name: "Merge Sort", complexity: "O(n log n)", href: "/compare?a=heap-sort&b=merge-sort" },
    { name: "Selection Sort", complexity: "O(n²)", href: "/compare?a=heap-sort&b=selection-sort" },
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
          I&nbsp;<em>seřazené</em> pole se musí přestavět na&nbsp;haldu a&nbsp;n-krát z&nbsp;ní odebrat maximum.
        </>
      ),
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(n log n)",
      note: <>Stavba haldy stojí O(n), každé z&nbsp;n odebrání nejvýš výšku stromu, log&nbsp;n.</>,
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n log n)",
      note: <>Žádný vstup ho nezpomalí víc — na&nbsp;rozdíl od&nbsp;Quick Sortu.</>,
      tone: "good",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(1)",
      note: (
        <>
          Halda leží přímo v&nbsp;poli, třídí <em>in-place</em>. Stabilní ale není.
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
        { label: "heap sort · O(n log n)", grows: GROWTH.nLogN },
        { label: "selection · O(n²)", grows: GROWTH.n2, style: "dash" },
      ]}
    />
  ),
  related: ["selection-sort", "quick-sort"],
  next: {
    name: "Binary Search",
    group: "search",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    complexity: "O(log n)",
    level: "beginner",
    href: "/algorithms/binary-search",
  },
};
