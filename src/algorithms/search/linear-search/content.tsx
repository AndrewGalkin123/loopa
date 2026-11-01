import { Search } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Linear Search page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Linear Search <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Jeden po&nbsp;druhém.</span> Lineární vyhledávání prochází pole od&nbsp;začátku
      a&nbsp;každý prvek porovná s&nbsp;hledanou hodnotou. Skončí, jakmile ji najde, nebo až když dojde na&nbsp;konec
      pole. Víc v&nbsp;tom není.
    </p>
    <p>
      Jeho síla je v&nbsp;tom, co <em>nepotřebuje</em>: pole nemusí být seřazené a&nbsp;stačí k&nbsp;němu postupný
      průchod, takže funguje i&nbsp;na&nbsp;spojovém seznamu.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když jsou data neseřazená nebo je jich málo. U&nbsp;pár desítek prvků je rozdíl proti chytřejším metodám
      zanedbatelný a&nbsp;kód je nejjednodušší. Hledáš-li v&nbsp;<strong>velkém poli opakovaně</strong>, vyplatí se ho
      jednou seřadit a&nbsp;použít binární vyhledávání.
    </p>

    <div className="callout">
      <div className="q">Kolik pohledů to průměrně stojí?</div>
      <p>
        Je-li hodnota v&nbsp;poli a&nbsp;na&nbsp;každém místě se stejnou pravděpodobností, přibližně n/2. Pokud v&nbsp;poli
        není, vždy všech n: nepřítomnost lze potvrdit až po&nbsp;prohlédnutí každého prvku.
      </p>
    </div>

    <p className="pull">„Nejhorší případ je odpověď ‚tady to není‘.“</p>

    <p>
      V&nbsp;přehrávači je zkoumaný prvek <span style={{ color: "var(--viz-compared)" }}>žlutý</span>, už prohlédnuté
      prvky jsou ztlumené a&nbsp;nalezený je <span style={{ color: "var(--viz-sorted)" }}>azurový</span>. Vyzkoušej
      tlačítko <em>Mimo pole</em> a&nbsp;sleduj, jak algoritmus musí projít úplně všechno.
    </p>
  </>
);

export const linearSearchContent: AlgorithmContent = {
  readMinutes: 3,
  lede: (
    <>
      Nejjednodušší vyhledávání: projde prvky jeden po&nbsp;druhém. Pomalé na&nbsp;velkých polích, ale jako jediné
      z&nbsp;této trojice <em>nepotřebuje</em> seřazená data.
    </>
  ),
  compareWith: [
    { name: "Binary Search", complexity: "O(log n)", href: "#" },
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
      note: <>Hledaná hodnota je hned na&nbsp;prvním místě.</>,
      tone: "good",
    },
    {
      label: "Average case",
      sub: "průměrný případ",
      bigO: "O(n)",
      note: <>Je-li hodnota v&nbsp;poli, stojí to průměrně přibližně n/2 pohledů.</>,
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(n)",
      note: <>Hodnota je na&nbsp;konci nebo v&nbsp;poli vůbec není.</>,
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(1)",
      note: <>Stačí jediná proměnná i.</>,
      tone: "good",
    },
  ],
  related: ["binary-search", "interpolation-search"],
  next: {
    name: "Binary Search",
    group: "search",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    complexity: "O(log n)",
    level: "beginner",
    href: "/algorithms/binary-search",
  },
};
