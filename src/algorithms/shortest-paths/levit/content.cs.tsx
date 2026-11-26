import { TrendingDown } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* Everything the Levit page shows besides the player. */

const description = (
  <>
    <div className="section-marker">01 / Popis</div>
    <h2>
      Jak Levit <em>funguje</em>
    </h2>
    <p>
      <span className="drop">Tři množiny.</span> Vrcholy jsou rozdělené do&nbsp;množin M2 (zatím nedosažené), M1 (čekají
      ve&nbsp;frontě) a&nbsp;M0 (vzdálenost spočítaná, i&nbsp;když možná ne definitivně). Algoritmus bere vrcholy ze
      začátku dvoustranné fronty, přesune je do&nbsp;M0 a&nbsp;zkouší přes ně uvolnit hrany.
    </p>
    <p>
      Důležité je, kam se vrchol po&nbsp;zlepšení zařadí. Nový vrchol z&nbsp;M2 jde <strong>na&nbsp;konec</strong> fronty.
      Vrchol z&nbsp;M0 jde <strong>na&nbsp;začátek</strong>: jeho sousedé už počítali se starou hodnotou, takže je chyba
      potřeba opravit co nejdřív. Vrchol, který už ve&nbsp;frontě je, jen dostane novou hodnotu d.
    </p>

    <h2>
      Kdy ho <em>použít</em>
    </h2>
    <p>
      Na&nbsp;běžných grafech bývá v&nbsp;praxi rychlý a&nbsp;zvládá záporné hrany. Na&nbsp;rozdíl od&nbsp;Dijkstry ale
      nemá uzavřené vrcholy, a&nbsp;na&nbsp;rozdíl od&nbsp;Bellmana-Forda nemá dobrou záruku pro nejhorší případ, takže se
      nehodí tam, kde vstup může připravit útočník.
    </p>

    <div className="callout">
      <div className="q">Jak je to se složitostí?</div>
      <p>
        Prameny se rozcházejí. Přehled cp-algorithms uvádí, že existují vstupy s&nbsp;<em>exponenciálním</em> časem,
        některé popisy na&nbsp;webu naopak udávají O(V&nbsp;·&nbsp;E). Tato stránka vychází z&nbsp;první varianty, stejně
        jako popis příbuzného algoritmu D&apos;Esopo–Pape. Záporný cyklus by původní algoritmus zacyklil; přehrávač ho
        pozná podle cyklu v&nbsp;odkazech π a&nbsp;běh zastaví.
      </p>
    </div>

    <p className="pull">„Kdo už se počítal a&nbsp;zlepšil se, musí na&nbsp;řadu hned.“</p>

    <p>
      V&nbsp;přehrávači jsou vrcholy z&nbsp;M1 <span style={{ color: "var(--viz-frontier)" }}>růžové</span>, z&nbsp;M0{" "}
      <span style={{ color: "var(--viz-done)" }}>azurové</span> a&nbsp;pod obrázkem je vidět fronta. Na&nbsp;výchozím
      grafu sleduj vrchol B: nejdřív se zpracuje s&nbsp;d=4, pak záporná hrana C→B hodnotu zlepší a&nbsp;B skočí zpět
      na&nbsp;začátek fronty.
    </p>
  </>
);

export const levitContent: AlgorithmContent = {
  readMinutes: 6,
  lede: (
    <>
      Tři množiny vrcholů a&nbsp;dvoustranná fronta. Zlepšený vrchol se vrací <em>na&nbsp;začátek</em>, nový jde
      na&nbsp;konec. V&nbsp;praxi rychlý, v&nbsp;nejhorším případě ale bez záruky.
    </>
  ),
  compareWith: [
    { name: "Dijkstra", complexity: "O(E log V)", href: "#" },
    { name: "Bellman-Ford", complexity: "O(V · E)", href: "#" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Typical",
      sub: "běžné grafy",
      bigO: "—",
      note: <>V&nbsp;praxi často rychlý; přesný odhad závisí na&nbsp;grafu.</>,
      tone: "good",
    },
    {
      label: "Worst case",
      sub: "nejhorší případ",
      bigO: "exp.",
      note: <>Podle cp-algorithms existují vstupy s&nbsp;exponenciálním časem. Jiné zdroje uvádějí O(V&nbsp;·&nbsp;E).</>,
      tone: "bad",
    },
    {
      label: "Space",
      sub: "paměť",
      bigO: "O(V)",
      note: <>Pole d, π, množiny a&nbsp;fronta, ve&nbsp;které je každý vrchol nejvýš jednou.</>,
      tone: "good",
    },
  ],
  related: ["dijkstra", "bellman-ford"],
  next: {
    name: "Gradient Descent",
    group: "optimization",
    badge: { variant: "optimization", icon: TrendingDown, label: "opt" },
    complexity: "iterative",
    level: "advanced",
    href: "/algorithms",
  },
};
