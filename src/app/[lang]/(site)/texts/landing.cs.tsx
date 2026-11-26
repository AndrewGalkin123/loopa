import type { LandingTexts } from "./landing";

/* The landing page in Czech (texts from design/Landing.html). */
export const LANDING_CS: LandingTexts = {
  hero: {
    title: (
      <>
        Algoritmy,
        <br />
        vysvětlené <em>vizuálně</em>.
      </>
    ),
    lede: (
      <>
        Interaktivní vizualizace matematických a algoritmických postupů. Pro studenty, kteří chtějí&nbsp;skutečně
        rozumět.
      </>
    ),
    start: "Začít teď",
    catalog: "Procházet katalog",
  },
  explore: {
    title: (
      <>
        Pochopte do hloubky, <em>jak fungují</em>.
      </>
    ),
    text: "Šest klasiků na začátek. Pošlapaná teorie z přednášek, převedená do kroků, které vidíte a ovládáte.",
    all: "Všechny algoritmy",
  },
  featured: [
    "Jednoduchý algoritmus třídění. Ideální pro pochopení principů porovnání a\u00a0výměn sousedních prvků.",
    "Rozděl a\u00a0panuj. Volí pivot a\u00a0rekurzivně třídí dvě poloviny. Mistr v\u00a0praxi, choulostivý v\u00a0nejhorším případě.",
    "Vyhledávání v\u00a0seřazeném poli. V\u00a0každém kroku zahodí polovinu prostoru. Logaritmické, elegantní.",
    "Prochází graf vrstvu po\u00a0vrstvě jako vlna na\u00a0hladině. Najde nejkratší cestu v\u00a0neváženém grafu.",
    "Najde nejkratší cestu z\u00a0jednoho zdroje ve\u00a0váženém grafu s\u00a0nezápornými hranami.",
    "Klasický problém dynamického programování. Maximalizuj hodnotu při omezené kapacitě.",
  ],
  compare: {
    title: (
      <>
        Dva algoritmy. Jeden vstup. <em>Jedna pravda.</em>
      </>
    ),
    text: (
      <>
        Spusťte Bubble Sort a&nbsp;Quicksort na&nbsp;identickém poli a&nbsp;sledujte, jak se rozcházejí — krok za
        krokem, porovnání za porovnáním. Žádná teorie. Konkrétní čísla.
      </>
    ),
    open: "Otevřít srovnání",
    openFull: "Otevřít plné srovnání",
  },
  ai: {
    title: (
      <>
        Zeptej se na <em>cokoli</em>.
      </>
    ),
    text: (
      <>
        Vestavěný asistent vysvětluje libovolný algoritmus na&nbsp;základě ověřeného materiálu. Žádné halucinace — jen
        prověřené znalosti.
      </>
    ),
    features: [
      <>
        <b>Ověřený korpus</b> — zdrojem jsou učebnice, ne web
      </>,
      <>
        <b>Krokově přesný</b> — ví, kde je plejer právě teď
      </>,
      <>
        <b>Citace na kliknutí</b> — každé tvrzení s&nbsp;odkazem
      </>,
    ],
    tryIt: "Vyzkoušet",
    question1: "Proč se bubble sort nazývá „bubble\"?",
    answer1: (
      <>
        Větší prvky postupně „probublávají&quot; ke&nbsp;konci pole — v&nbsp;každém průchodu se největší zbývající
        hodnota usadí na&nbsp;své finální místo, podobně jako vzduchová bublina stoupající k&nbsp;hladině.
      </>
    ),
    question2: "A nejhorší případ?",
    answer2: (
      <>
        O(n²) — když je vstup seřazen sestupně. Tehdy provede <span className="mono-inline">n(n−1)/2</span> porovnání
        a&nbsp;stejný počet výměn.
      </>
    ),
    placeholder: <>Zeptej se na cokoli o&nbsp;tomto algoritmu…</>,
  },
  forYou: {
    title: (
      <>
        Není to <em>Brilliant.</em> Není to <em>visualgo.</em>
      </>
    ),
    text: (
      <>
        Stavíme pro lidi, kteří chtějí algoritmům opravdu rozumět — ne sbírat odznáčky a&nbsp;procházet padesát kvízů,
        než se dostanou k&nbsp;první myšlence.
      </>
    ),
    crossed: "Hra. Mise. Odznáčky.",
    claim: "Hloubka místo šířky. Pochopení místo postupu.",
  },
  features: [
    {
      title: "Hluboká",
      em: "vysvětlení",
      text: "Ne tři řádky a\u00a0animace. Celá teorie — invarianty, hraniční případy, důkaz správnosti, kompromisy v\u00a0praxi.",
    },
    {
      title: "Skutečné",
      em: "srovnání",
      text: "Postavte dva algoritmy proti sobě na\u00a0stejných datech a\u00a0uvidíte rozdíl vlastníma očima. Žádné tabulky složitostí v\u00a0knize.",
    },
    {
      title: "Bez",
      em: "gamifikace",
      text: "Žádné mise, žádné série, žádná virtuální měna. Jen znalosti, vizualizace a\u00a0čas na\u00a0přemýšlení.",
    },
  ],
  final: {
    title: (
      <>
        Připraveni rozumět <em>algoritmům?</em>
      </>
    ),
    text: <>Začněte s&nbsp;Bubble Sort. Nebo se ponořte rovnou do&nbsp;Dijkstry. Bez registrace, bez závazku.</>,
    start: "Začít",
    catalog: "Procházet katalog",
  },
};
