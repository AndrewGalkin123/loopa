import { Repeat } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Dijkstra page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Dijkstra <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Vždy nejbližší.</span> Algoritmus si u&nbsp;každého vrcholu drží nejlepší dosud známou
      vzdálenost d[v] od&nbsp;startu. V&nbsp;každém kroku vezme z&nbsp;neuzavřených vrcholů ten s&nbsp;nejmenší d,
      uzavře ho a&nbsp;zkusí přes něj zlepšit cesty k&nbsp;sousedům. Tomuto zlepšení se říká <em>relaxace</em>.
    </p>
    <p>
      Hodnota d se tedy může během běhu <strong>měnit</strong>: první nalezená cesta nemusí být nejkratší. Definitivní
      je až ve chvíli, kdy se vrchol uzavře.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když hledáš nejkratší cesty z&nbsp;jednoho vrcholu ve&nbsp;váženém grafu bez záporných hran: trasy
      v&nbsp;navigaci, směrování v&nbsp;síti. Pokud mají všechny hrany stejnou váhu, stačí jednodušší BFS. Pokud se
      objeví záporné hrany, sáhni po&nbsp;Bellmanovi-Fordovi.
    </p>

    <div className="callout">
      <div className="q">Proč je bezpečné vrchol uzavřít?</div>
      <p>
        Všechny hrany mají nezápornou váhu. Každá jiná cesta k&nbsp;vrcholu u&nbsp;by musela vést přes některý
        neuzavřený vrchol, a&nbsp;ten už má d aspoň tak velké jako u. Další hrany ji mohou jen prodloužit, takže
        kratší být nemůže. Se zápornou hranou tento argument neplatí a&nbsp;algoritmus může vrátit špatný výsledek.
      </p>
    </div>

    <p className="pull">„Nejmenší d je už definitivní. Všechno ostatní se ještě může zlepšit.“</p>

    <p>
      V&nbsp;přehrávači jsou vrcholy ve&nbsp;frontě <span style={{ color: "var(--viz-frontier)" }}>růžové</span>,
      právě uzavíraný <span style={{ color: "var(--viz-active)" }}>limetkový</span> a&nbsp;uzavřené{" "}
      <span style={{ color: "var(--viz-done)" }}>azurové</span>. Azurové hrany tvoří strom nejkratších cest; když se
      najde lepší cesta, hrana v&nbsp;něm se přepojí. Vyzkoušej graf <em>detour</em>, kde je objížďka kratší než přímá
      hrana.
    </p>
  </>
);

export const dijkstraContent: AlgorithmContent = {
  readMinutes: 6,
  lede: (
    <>
      Nejkratší cesty z&nbsp;jednoho vrcholu ve&nbsp;váženém grafu. <em>Hladově</em> uzavírá nejbližší vrchol a&nbsp;přes
      něj zlepšuje cesty dál. Funguje jen bez záporných hran.
    </>
  ),
  compareWith: [
    { name: "Bellman-Ford", complexity: "O(V · E)", href: "#" },
    { name: "Levit", complexity: "exp. (worst)", href: "#" },
    { name: "BFS", complexity: "O(V + E)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Time",
      sub: "binární halda",
      bigO: "O((V + E) log V)",
      note: <>Pro souvislý graf se to zapisuje O(E&nbsp;log&nbsp;V). Každá relaxace může přidat záznam do&nbsp;haldy.</>,
      tone: "good",
    },
    {
      label: "Time",
      sub: "pole",
      bigO: "O(V²)",
      note: <>Minimum se hledá průchodem polem. Na&nbsp;hustých grafech to může stačit.</>,
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(V + E)",
      note: <>Pole d a&nbsp;π a&nbsp;halda; se zastaralými záznamy může mít až O(E) položek.</>,
    },
    {
      label: "Záporné hrany",
      sub: "omezení",
      bigO: "—",
      note: <>Algoritmus na&nbsp;ně není určen a&nbsp;výsledek může být chybný.</>,
      tone: "bad",
    },
  ],
  related: ["bfs", "bellman-ford"],
  next: {
    name: "Bellman-Ford",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Repeat, label: "bf" },
    complexity: "O(V · E)",
    level: "advanced",
    href: "/algorithms/bellman-ford",
  },
};
