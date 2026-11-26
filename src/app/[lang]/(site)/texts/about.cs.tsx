import type { AboutTexts } from "./about";

/* The About page in Czech (texts from design/About.html). */
export const ABOUT_CS: AboutTexts = {
  metaTitle: "Proč Loopa? — About",
  title: "Proč Loopa?",
  lede: (
    <>
      Algoritmy jsou srdcem programování. Skoro nikdo je ale nevysvětluje <em>pořádně.</em>
    </>
  ),
  story: {
    title: (
      <>
        Začalo to <em>frustrací.</em>
      </>
    ),
    paragraphs: [
      <>
        Jsem student programování. Když jsem se poprvé setkal s&nbsp;algoritmy na&nbsp;přednáškách, většina
        z&nbsp;nich mi přišla jako šum. Bubble sort? Dijkstra? Gradient descent? Slyšel jsem ta slova, viděl pseudokód,
        ale <strong>opravdu rozumět</strong> tomu, co se uvnitř děje — to byl jiný level.
      </>,
      <>
        Existují skvělé zdroje. <em>3Blue1Brown</em> dělá kouzla s&nbsp;matematikou. <em>Visualgo</em> má solidní
        vizualizace. <em>Brilliant</em> je dobře designovaný. Ale nic z&nbsp;toho mi nestačilo. Chtěl jsem nástroj, kde
        si můžu <strong>pohrát</strong> s&nbsp;algoritmem — měnit data, srovnávat, ptát se.
      </>,
      <>Tak jsem si ho začal stavět sám. Loopa je výsledek.</>,
    ],
    author: "autor",
    kind: "typ",
    kindValue: "Bakalářská práce",
    year: "rok",
    count: "algoritmů",
    growing: "a\u00a0roste",
  },
  mission: {
    title: (
      <>
        Tři pravidla, <em>žádné výjimky.</em>
      </>
    ),
    principles: [
      {
        title: (
          <>
            Hloubka před <em>šířkou</em>
          </>
        ),
        text: (
          <>
            Devět algoritmů vysvětlených pořádně je víc než padesát s&nbsp;třemi řádky textu. Každý má teorii,
            vizualizaci, kód, složitost a&nbsp;kontext.
          </>
        ),
      },
      {
        title: (
          <>
            Bez <em>gamifikace</em>
          </>
        ),
        text: (
          <>
            Žádné odznáčky, série, virtuální měna, dopamin-hits. Jen znalosti, vizualizace a&nbsp;čas na&nbsp;přemýšlení.
            Učení nemusí být zábavné — musí být srozumitelné.
          </>
        ),
      },
      {
        title: (
          <>
            Zdarma <em>navždy</em>
          </>
        ),
        text: (
          <>
            Základ je zdarma a&nbsp;vždy bude. Pro pokročilé funkce existuje Pro tier, ale 95&nbsp;% obsahu je dostupné
            komukoliv bez registrace.
          </>
        ),
      },
    ],
  },
  stack: {
    title: (
      <>
        Postaveno na&nbsp;<em>solidních základech</em>
      </>
    ),
    intro: (
      <>
        Loopa běží na&nbsp;moderním stacku. Žádné magické black boxy — všechno je <em>standardní</em>, otestované,
        otevřené.
      </>
    ),
  },
  status: {
    title: (
      <>
        Co je <em>hotové</em> a&nbsp;co <em>přijde</em>
      </>
    ),
    done: "hotovo",
    doneItems: [
      <>9 algoritmů s&nbsp;plnou teorií</>,
      <>Režim porovnání</>,
      <>AI asistent</>,
      <>Česká a&nbsp;anglická verze</>,
    ],
    next: "na cestě",
    nextItems: [<>Cvičení s&nbsp;kontrolou</>, <>Mobilní aplikace</>, <>Učitelský režim</>, <>Více algoritmů</>],
  },
  connect: {
    title: (
      <>
        Máte <em>otázku?</em>
      </>
    ),
    text: "Našli jste chybu? Máte návrh? Chcete spolupracovat? Ozvěte se.",
  },
  final: {
    title: (
      <>
        Připraveni <em>začít?</em>
      </>
    ),
    algorithms: "Procházet algoritmy",
    compare: "Otevřít porovnání",
    signoff: "Loopa · bakalářská práce 2026 · Andrew Halkin",
  },
  ask: "Zeptej se",
  askAria: "Máte otázku?",
};
