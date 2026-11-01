import { Route } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the DFS page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak DFS <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Jako průzkum bludiště.</span> DFS vstoupí do&nbsp;vrcholu, označí ho a&nbsp;hned
      pokračuje do&nbsp;prvního dosud nenavštíveného souseda — a&nbsp;odtud zase dál. Teprve když žádný nový soused
      není, vrátí se do&nbsp;vrcholu, ze kterého přišel, a&nbsp;zkusí jeho dalšího souseda.
    </p>
    <p>
      Návrat zpět obstarává <em>rekurze</em>: každé volání visit(u) čeká, dokud neskončí všechna volání, která
      z&nbsp;něj vznikla. Zásobník pod obrázkem ukazuje přesně tuto cestu od&nbsp;startu k&nbsp;aktuálnímu vrcholu.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když potřebuješ projít celý graf a&nbsp;záleží na&nbsp;jeho struktuře, ne na&nbsp;vzdálenostech: najít komponenty
      souvislosti, zjistit, jestli graf obsahuje cyklus, seřadit úlohy podle závislostí (topologické řazení) nebo projít
      všechny možnosti hlavolamu (backtracking). Nejkratší cesty ale DFS nenajde — na&nbsp;ty je BFS.
    </p>

    <div className="callout">
      <div className="q">Rekurze, nebo vlastní zásobník?</div>
      <p>
        Obojí jde. Rekurzivní verze je kratší a&nbsp;odpovídá definici; iterativní s&nbsp;vlastním zásobníkem nespadne
        u&nbsp;velmi hlubokých grafů na&nbsp;přetečení zásobníku volání. Pozor ale: když iterativní verze značí vrchol
        jako navštívený už při vložení na&nbsp;zásobník, pořadí návštěv přestane odpovídat DFS.
      </p>
    </div>

    <p className="pull">„Nejdřív do&nbsp;hloubky. Zpátky až ve&nbsp;slepé uličce.“</p>

    <p>
      V&nbsp;přehrávači je aktuální vrchol <span style={{ color: "var(--viz-active)" }}>limetkový</span>, vrcholy
      čekající na&nbsp;zásobníku <span style={{ color: "var(--viz-frontier)" }}>růžové</span> a&nbsp;hotové{" "}
      <span style={{ color: "var(--viz-done)" }}>azurové</span> — vrchol je hotový, až když se z&nbsp;něj rekurze
      vrátí. Azurové hrany tvoří strom DFS. Porovnej na&nbsp;grafu <em>tree</em> pořadí s&nbsp;BFS: DFS projde nejdřív
      celou levou větev.
    </p>
  </>
);

export const dfsContent: AlgorithmContent = {
  readMinutes: 5,
  lede: (
    <>
      Prohledávání do&nbsp;hloubky. Jde po&nbsp;jedné cestě tak daleko, jak to jen jde, a&nbsp;teprve ve&nbsp;slepé
      uličce se vrátí o&nbsp;krok zpět. Základ pro hledání cyklů, komponent i&nbsp;<em>topologické řazení</em>.
    </>
  ),
  compareWith: [
    { name: "BFS", complexity: "O(V + E)", href: "#" },
    { name: "Dijkstra", complexity: "O(E log V)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Time",
      sub: "seznamy sousedů",
      bigO: "O(V + E)",
      note: <>Každý vrchol se navštíví jednou a&nbsp;každá hrana se zkontroluje dvakrát — z&nbsp;obou konců.</>,
      tone: "good",
    },
    {
      label: "Time",
      sub: "matice sousednosti",
      bigO: "O(V²)",
      note: <>Je-li graf uložen maticí, stojí hledání sousedů jednoho vrcholu O(V), celkem tedy O(V²).</>,
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(V)",
      note: <>Pole visited a&nbsp;zásobník rekurze — u&nbsp;grafu, který je jednou dlouhou cestou, až V volání.</>,
    },
  ],
  related: ["bfs", "dijkstra"],
  next: {
    name: "Dijkstra",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Route, label: "path" },
    complexity: "O(E log V)",
    level: "advanced",
    href: "/algorithms",
  },
};
