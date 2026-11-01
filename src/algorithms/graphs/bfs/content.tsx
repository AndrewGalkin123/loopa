import { Route } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the BFS page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak BFS <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Jako vlna na hladině.</span> BFS začne ve startovním vrcholu a postupuje po&nbsp;vrstvách:
      nejdřív navštíví všechny vrcholy ve vzdálenosti 1, pak ve vzdálenosti 2 a&nbsp;tak dál. Pořadí hlídá{" "}
      <em>fronta</em> — kdo byl nalezen dřív, přijde dřív na&nbsp;řadu.
    </p>
    <p>
      Vrchol se značí jako navštívený <strong>už ve chvíli, kdy vstoupí do&nbsp;fronty</strong>, ne až když z&nbsp;ní
      vyjde. Díky tomu se do&nbsp;fronty nikdy nedostane dvakrát a&nbsp;jeho vzdálenost d[v] je určená hned při prvním
      nalezení.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Když hledáš nejkratší cestu podle počtu hran: nejmenší počet přestupů, tahů v&nbsp;hlavolamu nebo kroků
      v&nbsp;bludišti. BFS zaručuje, že první nalezení vrcholu je zároveň to nejkratší. Ve&nbsp;váženém grafu ale
      nestačí — tam nastupuje Dijkstra.
    </p>

    <div className="callout">
      <div className="q">Proč fronta, a&nbsp;ne zásobník?</div>
      <p>
        Fronta vydává vrcholy ve&nbsp;stejném pořadí, v&nbsp;jakém byly nalezeny, takže se nejdřív zpracuje celá vrstva
        ve&nbsp;vzdálenosti k a&nbsp;teprve pak vrstva k&nbsp;+&nbsp;1. Se zásobníkem by algoritmus utíkal
        do&nbsp;hloubky — z&nbsp;BFS by se stal DFS a&nbsp;d[v] by už nemusela být nejmenší.
      </p>
    </div>

    <p className="pull">„Kdo byl nalezen dřív, přijde dřív na&nbsp;řadu.“</p>

    <p>
      V&nbsp;přehrávači jsou vrcholy ve&nbsp;frontě <span style={{ color: "var(--viz-frontier)" }}>růžové</span>,
      právě zpracovávaný <span style={{ color: "var(--viz-active)" }}>limetkový</span> a&nbsp;hotové{" "}
      <span style={{ color: "var(--viz-done)" }}>azurové</span>. Azurové hrany tvoří strom BFS: každý vrchol v&nbsp;něm
      visí na&nbsp;hraně, přes kterou byl nalezen, a&nbsp;popisek d=… je jeho vzdálenost od&nbsp;startu. Vyzkoušej graf{" "}
      <em>components</em>: vrcholy druhé komponenty BFS nikdy nenajde.
    </p>
  </>
);

export const bfsContent: AlgorithmContent = {
  readMinutes: 5,
  lede: (
    <>
      Prohledávání do&nbsp;šířky. Od&nbsp;startu se šíří jako vlna — nejdřív sousedé, pak sousedé sousedů. Proto
      v&nbsp;neohodnoceném grafu najde <em>nejkratší</em> cesty.
    </>
  ),
  compareWith: [
    { name: "DFS", complexity: "O(V + E)", href: "#" },
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
      note: (
        <>
          Každý vrchol vstoupí do&nbsp;fronty nejvýš jednou a&nbsp;každá hrana se zkontroluje dvakrát — z&nbsp;obou
          konců.
        </>
      ),
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
      note: <>Fronta a&nbsp;pole visited a&nbsp;d — každé nejvýš o&nbsp;V prvcích.</>,
    },
  ],
  related: ["dfs", "dijkstra"],
  next: {
    name: "Dijkstra",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Route, label: "path" },
    complexity: "O(E log V)",
    level: "advanced",
    href: "/algorithms",
  },
};
