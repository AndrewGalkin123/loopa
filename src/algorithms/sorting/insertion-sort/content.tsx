import { Zap } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { ComplexityChart, GROWTH } from "@/components/ComplexityChart";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Insertion Sort page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Insertion Sort <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Jako karty v&nbsp;ruce.</span> Levá část pole je vždy seřazená. Algoritmus vezme první
      prvek z&nbsp;neseřazené části — <em>klíč</em> — a&nbsp;posouvá větší prvky o&nbsp;jedno místo doprava, dokud
      pro&nbsp;klíč nevznikne správná mezera. Pak ho do&nbsp;ní vloží a&nbsp;seřazená část je o&nbsp;prvek delší.
    </p>
    <p>
      Pozor na&nbsp;rozdíl od&nbsp;Bubble Sort: <em>posun</em> není výměna. Klíč čeká stranou v&nbsp;proměnné, takže
      posun zapíše jedinou hodnotu, zatímco výměna dvě. Sloupce v&nbsp;přehrávači ukazují klíč přímo v&nbsp;mezeře, kterou
      právě prochází — ve&nbsp;skutečném poli je na&nbsp;tom místě až do&nbsp;vložení stará kopie sousední hodnoty.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Na&nbsp;malá a&nbsp;téměř seřazená pole. Počet posunů se přesně rovná počtu <em>inverzí</em> — dvojic prvků, které
      stojí v&nbsp;opačném pořadí. Když je jich málo, algoritmus doběhne skoro v&nbsp;lineárním čase. Proto ho na&nbsp;krátké
      úseky používají i&nbsp;rychlé hybridní algoritmy, například Timsort.
    </p>

    <div className="callout">
      <div className="q">Proč v&nbsp;podmínce stojí A[j] &gt; key, a&nbsp;ne ≥?</div>
      <p>
        Kvůli <em>stabilitě</em>. Se&nbsp;znakem &gt; se klíč zastaví před stejně velkým prvkem, takže stejné hodnoty
        zachovají původní pořadí. Se&nbsp;znakem ≥ by pole bylo také seřazené, ale stejné prvky by se zbytečně
        přeskakovaly a&nbsp;jejich pořadí by se obrátilo.
      </p>
    </div>

    <p className="pull">„Levá strana je vždy seřazená. Otázka je jen, kam patří další prvek.“</p>

    <p>
      V&nbsp;přehrávači je klíč <span style={{ color: "var(--viz-pivot)" }}>růžový</span>, prvek, se kterým se porovnává,{" "}
      <span style={{ color: "var(--viz-compared)" }}>jantarový</span> a&nbsp;právě posunutý{" "}
      <span style={{ color: "var(--viz-active)" }}>limetkový</span>. Levá část ještě není{" "}
      <span style={{ color: "var(--viz-sorted)" }}>azurová</span>: je sice seřazená, ale další klíč do&nbsp;ní může
      vstoupit a&nbsp;hodnoty posunout. Konečné jsou až na&nbsp;konci.
    </p>
  </>
);

export const insertionSortContent: AlgorithmContent = {
  readMinutes: 5,
  lede: (
    <>
      Řazení vkládáním. Bere prvky jeden po&nbsp;druhém a&nbsp;zařazuje je do&nbsp;seřazené části, stejně jako karty
      v&nbsp;ruce. Na&nbsp;téměř seřazených datech je <em>skoro lineární</em>.
    </>
  ),
  compareWith: [
    { name: "Bubble Sort", complexity: "O(n²)", href: "/compare?a=insertion-sort&b=bubble-sort" },
    { name: "Selection Sort", complexity: "O(n²)", href: "/compare?a=insertion-sort&b=selection-sort" },
    { name: "Quick Sort", complexity: "O(n log n)", href: "/compare?a=insertion-sort&b=quick-sort" },
    { name: "Merge Sort", complexity: "O(n log n)", href: "/compare?a=insertion-sort&b=merge-sort" },
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
          Pole je <em>již seřazené</em>: n − 1 porovnání a&nbsp;žádný posun.
        </>
      ),
      tone: "good",
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(n²)",
      note: <>Náhodné pořadí: v&nbsp;průměru se klíč posune přes polovinu seřazené části.</>,
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n²)",
      note: (
        <>
          Pole seřazené <em>sestupně</em>: každý klíč musí až na&nbsp;začátek, n(n − 1)/2 posunů.
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
          Třídí <em>in-place</em>, navíc potřebuje jen proměnnou pro&nbsp;klíč.
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
        { label: "nejhorší případ · O(n²)", grows: GROWTH.n2 },
        { label: "nejlepší případ · O(n)", grows: GROWTH.n, style: "dash" },
      ]}
    />
  ),
  related: ["selection-sort", "bubble-sort"],
  next: {
    name: "Quick Sort",
    group: "sorting",
    badge: { variant: "sorting", icon: Zap, label: "fast" },
    complexity: "O(n log n)",
    level: "intermediate",
    href: "/algorithms/quick-sort",
  },
};
