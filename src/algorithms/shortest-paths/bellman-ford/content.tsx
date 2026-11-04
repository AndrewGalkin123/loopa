import { ArrowLeftRight } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Bellman-Ford page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Bellman-Ford <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Hrubou silou, ale spolehlivě.</span> Algoritmus nevybírá žádný nejlepší vrchol. Prostě
      projde všechny hrany a&nbsp;každou zkusí uvolnit, tedy zlepšit přes ni vzdálenost d[v]. A&nbsp;pak to zopakuje.
    </p>
    <p>
      Po&nbsp;k-tém průchodu jsou správně všechny nejkratší cesty, které mají nejvýš k hran. Nejkratší cesta bez cyklu
      má nejvýš V&nbsp;−&nbsp;1 hran, takže tolik průchodů vždy stačí. Když průchod nic nezmění, může algoritmus skončit
      dřív.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když graf obsahuje <strong>záporné hrany</strong> nebo potřebuješ zjistit, jestli v&nbsp;něm není záporný cyklus,
      například u&nbsp;hledání arbitráže mezi měnami. Bez záporných hran je Dijkstra rychlejší. Graf je tu orientovaný:
      neorientovaná záporná hrana by sama o&nbsp;sobě byla záporným cyklem.
    </p>

    <div className="callout">
      <div className="q">K čemu je ten poslední průchod?</div>
      <p>
        Po&nbsp;V&nbsp;−&nbsp;1 průchodech už by se žádná vzdálenost neměla dát zlepšit. Pokud to přesto jde, existuje
        záporný cyklus dosažitelný ze startu: každé další kolo by cestu ještě zkrátilo, takže nejkratší cesta
        neexistuje. Vyzkoušej graf <em>neg-cycle</em>.
      </p>
    </div>

    <p className="pull">„Po&nbsp;k průchodech jsou hotové všechny cesty o&nbsp;nejvýš k hranách.“</p>

    <p>
      V&nbsp;přehrávači je začátek zkoumané hrany <span style={{ color: "var(--viz-active)" }}>limetkový</span>, její
      konec <span style={{ color: "var(--viz-compared)" }}>žlutý</span> a&nbsp;vrcholy se známou vzdáleností{" "}
      <span style={{ color: "var(--viz-frontier)" }}>růžové</span>. Záporné váhy jsou červené. Počítadlo{" "}
      <em>pass</em> ukazuje, kolik průchodů bylo potřeba.
    </p>
  </>
);

export const bellmanFordContent: AlgorithmContent = {
  readMinutes: 6,
  lede: (
    <>
      Opakovaně uvolňuje všechny hrany. Pomalejší než Dijkstra, ale zvládne <em>záporné</em> váhy a&nbsp;odhalí záporný
      cyklus.
    </>
  ),
  compareWith: [
    { name: "Dijkstra", complexity: "O(E log V)", href: "#" },
    { name: "Levit", complexity: "exp. (worst)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "nejlepší případ",
      bigO: "O(E)",
      note: <>Pořadí hran je příznivé: po&nbsp;prvním průchodu je vše hotové a&nbsp;druhý nic nezmění.</>,
      tone: "good",
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "O(V · E)",
      note: <>V&nbsp;−&nbsp;1 průchodů přes všech E hran a&nbsp;jeden kontrolní navíc.</>,
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(V)",
      note: <>Pole d a&nbsp;π.</>,
      tone: "good",
    },
  ],
  related: ["dijkstra", "levit"],
  next: {
    name: "Levit",
    group: "shortest-path",
    badge: { variant: "shortest", icon: ArrowLeftRight, label: "lev" },
    complexity: "exp. (worst)",
    level: "advanced",
    href: "/algorithms/levit",
  },
};
