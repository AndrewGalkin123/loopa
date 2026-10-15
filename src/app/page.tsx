import {
  ArrowRight,
  ArrowUp,
  ArrowUpNarrowWide,
  BookOpen,
  GitBranch,
  GitCompare,
  Grid3x3,
  Route,
  Search,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AlgorithmCard, type AlgorithmCardData } from "@/components/AlgorithmCard";
import { CompareDemo } from "@/components/landing/CompareDemo";
import { HeroDemo } from "@/components/landing/HeroDemo";
import "./landing.css";

const FEATURED: AlgorithmCardData[] = [
  {
    num: "01",
    group: "sorting",
    badge: { variant: "sorting", icon: ArrowUpNarrowWide, label: "sort" },
    title: "Bubble Sort",
    tagline: "simple",
    description: "Jednoduchý algoritmus třídění. Ideální pro pochopení principů porovnání a\u00a0výměn sousedních prvků.",
    complexity: "O(n²)",
    level: "beginner",
    href: "/algorithms/bubble-sort",
  },
  {
    num: "02",
    group: "sorting",
    badge: { variant: "sorting", icon: Zap, label: "fast" },
    title: "Quicksort",
    tagline: "divide",
    description:
      "Rozděl a\u00a0panuj. Volí pivot a\u00a0rekurzivně třídí dvě poloviny. Mistr v\u00a0praxi, choulostivý v\u00a0nejhorším případě.",
    complexity: "O(n log n)",
    level: "intermediate",
  },
  {
    num: "03",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    title: "Binary Search",
    tagline: "halve",
    description: "Vyhledávání v\u00a0seřazeném poli. V\u00a0každém kroku zahodí polovinu prostoru. Logaritmické, elegantní.",
    complexity: "O(log n)",
    level: "beginner",
  },
  {
    num: "04",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitBranch, label: "bfs" },
    title: "Breadth-First",
    tagline: "ripples",
    description: "Prochází graf vrstvu po\u00a0vrstvě jako vlna na\u00a0hladině. Najde nejkratší cestu v\u00a0neváženém grafu.",
    complexity: "O(V + E)",
    level: "intermediate",
  },
  {
    num: "05",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Route, label: "path" },
    title: "Dijkstra",
    tagline: "greedy",
    description: "Najde nejkratší cestu z\u00a0jednoho zdroje ve\u00a0váženém grafu s\u00a0nezápornými hranami.",
    complexity: "O((V+E) log V)",
    level: "advanced",
  },
  {
    num: "06",
    group: "optimization",
    badge: { variant: "optimization", icon: Grid3x3, label: "dp" },
    title: "Knapsack",
    tagline: "pack",
    description: "Klasický problém dynamického programování. Maximalizuj hodnotu při omezené kapacitě.",
    complexity: "O(nW)",
    level: "advanced",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    letter: "A",
    tag: "depth",
    title: "Hluboká",
    em: "vysvětlení",
    text: "Ne tři řádky a\u00a0animace. Celá teorie — invarianty, hraniční případy, důkaz správnosti, kompromisy v\u00a0praxi.",
  },
  {
    icon: GitCompare,
    letter: "B",
    tag: "compare",
    title: "Skutečné",
    em: "srovnání",
    text: "Postavte dva algoritmy proti sobě na\u00a0stejných datech a\u00a0uvidíte rozdíl vlastníma očima. Žádné tabulky složitostí v\u00a0knize.",
  },
  {
    icon: ShieldOff,
    letter: "C",
    tag: "focus",
    title: "Bez",
    em: "gamifikace",
    text: "Žádné mise, žádné série, žádná virtuální měna. Jen znalosti, vizualizace a\u00a0čas na\u00a0přemýšlení.",
  },
];

export default function LandingPage() {
  return (
    <main className="page-landing">
      {/* ───────── HERO ───────── */}
      <section className="hero">
        <div className="eyebrow">
          <span>▲ Interactive Algorithm Visualizer</span>
          <span className="v">· v1.0</span>
        </div>
        <h1>
          Algoritmy,
          <br />
          vysvětlené <em>vizuálně</em>.
        </h1>
        <p className="lede">
          Interaktivní vizualizace matematických a algoritmických postupů. Pro studenty, kteří chtějí&nbsp;skutečně
          rozumět.
        </p>
        <div className="hero-ctas">
          <Link href="/algorithms/bubble-sort" className="btn btn-primary">
            Začít teď <ArrowRight size={14} />
          </Link>
          <Link href="/algorithms" className="btn btn-secondary">
            Procházet katalog
          </Link>
          <a href="#" className="docs-link">
            <span>
              <span className="prompt">$</span> docs --read
            </span>
            <span className="kbd-inline">⌘ D</span>
          </a>
        </div>

        <HeroDemo />
      </section>

      {/* ───────── 01 FEATURED ───────── */}
      <section>
        <div className="section-head">
          <div className="section-head-left">
            <div className="eyebrow">01 / Explore</div>
            <h2>
              Pochopte do hloubky, <em>jak fungují</em>.
            </h2>
            <p>Šest klasiků na začátek. Pošlapaná teorie z přednášek, převedená do kroků, které vidíte a ovládáte.</p>
          </div>
          <Link href="/algorithms" className="head-cta">
            Všechny algoritmy <ArrowRight />
          </Link>
        </div>

        <div className="cards-grid">
          {FEATURED.map((card) => (
            <AlgorithmCard key={card.num} {...card} />
          ))}
        </div>
      </section>

      {/* ───────── 02 COMPARE ───────── */}
      <section>
        <div className="section-head">
          <div className="section-head-left">
            <div className="eyebrow">02 / Signature Feature</div>
            <h2>
              Dva algoritmy. Jeden vstup. <em>Jedna pravda.</em>
            </h2>
            <p>
              Spusťte Bubble Sort a&nbsp;Quicksort na&nbsp;identickém poli a&nbsp;sledujte, jak se rozcházejí — krok za
              krokem, porovnání za porovnáním. Žádná teorie. Konkrétní čísla.
            </p>
          </div>
          <Link href="/compare" className="head-cta">
            Otevřít srovnání <ArrowRight />
          </Link>
        </div>

        <div className="compare-shell">
          <CompareDemo />
          <div className="compare-shell-foot">
            <div className="label">
              running on identical input · <span className="accent">n = 16</span> · live
            </div>
            <Link href="/compare" className="btn btn-secondary btn-sm">
              Otevřít plné srovnání <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── 03 AI ───────── */}
      <section>
        <div className="section-head">
          <div className="section-head-left">
            <div className="eyebrow">03 / AI Powered</div>
            <h2>
              Zeptej se na <em>cokoli</em>.
            </h2>
            <p>
              Vestavěný asistent vysvětluje libovolný algoritmus na&nbsp;základě ověřeného materiálu. Žádné halucinace —
              jen prověřené znalosti.
            </p>
          </div>
        </div>

        <div className="ai-grid">
          <div className="ai-copy">
            <ul className="ai-features">
              <li>
                <b>Ověřený korpus</b> — zdrojem jsou učebnice, ne web
              </li>
              <li>
                <b>Krokově přesný</b> — ví, kde je plejer právě teď
              </li>
              <li>
                <b>Citace na kliknutí</b> — každé tvrzení s&nbsp;odkazem
              </li>
            </ul>
            <a href="#" className="btn btn-primary">
              Vyzkoušet <ArrowRight size={14} />
            </a>
          </div>

          <div className="chat-mock" aria-hidden="true">
            <div className="head">
              <div>
                <div className="lbl">AI Assistant</div>
                <div className="sub">
                  asks about <span style={{ color: "var(--color-text-muted)" }}>bubble sort</span>
                </div>
              </div>
              <div className="pill">
                <ShieldCheck size={10} /> verified
              </div>
            </div>
            <div className="body">
              <div className="msg user">Proč se bubble sort nazývá „bubble&quot;?</div>
              <div className="msg ai">
                <Sparkles className="spark" size={14} />
                <div>
                  Větší prvky postupně „probublávají&quot; ke&nbsp;konci pole — v&nbsp;každém průchodu se největší
                  zbývající hodnota usadí na&nbsp;své finální místo, podobně jako vzduchová bublina stoupající
                  k&nbsp;hladině.
                </div>
              </div>
              <div className="msg user">A nejhorší případ?</div>
              <div className="msg ai">
                <Sparkles className="spark" size={14} />
                <div>
                  O(n²) — když je vstup seřazen sestupně. Tehdy provede <span className="mono-inline">n(n−1)/2</span>{" "}
                  porovnání a&nbsp;stejný počet výměn.
                </div>
              </div>
            </div>
            <div className="input-row">
              <span>Zeptej se na cokoli o&nbsp;tomto algoritmu…</span>
              <span className="send">
                <ArrowUp size={12} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 04 FOR YOU ───────── */}
      <section>
        <div className="section-head">
          <div className="section-head-left">
            <div className="eyebrow">04 / For You</div>
            <h2>
              Není to <em>Brilliant.</em> Není to <em>visualgo.</em>
            </h2>
            <p>
              Stavíme pro lidi, kteří chtějí algoritmům opravdu rozumět — ne sbírat odznáčky a&nbsp;procházet padesát
              kvízů, než se dostanou k&nbsp;první myšlence.
            </p>
          </div>
        </div>

        <div className="position-line">
          <div className="lhs">positioning</div>
          <div className="rhs">
            <s>Hra. Mise. Odznáčky.</s> &nbsp;→&nbsp; <b>Hloubka místo šířky. Pochopení místo postupu.</b>
          </div>
        </div>

        <div className="features-row">
          {FEATURES.map(({ icon: Icon, letter, tag, title, em, text }) => (
            <div className="feature" key={letter}>
              <div className="icon">
                <Icon size={18} />
              </div>
              <div className="num">
                <span className="accent">{letter}</span> / {tag}
              </div>
              <h3>
                {title} <em>{em}</em>
              </h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="final-cta">
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          — Ready
        </div>
        <h2>
          Připraveni rozumět <em>algoritmům?</em>
        </h2>
        <p>Začněte s&nbsp;Bubble Sort. Nebo se ponořte rovnou do&nbsp;Dijkstry. Bez registrace, bez závazku.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/algorithms/bubble-sort" className="btn btn-primary btn-lg">
            Začít <ArrowRight size={16} />
          </Link>
          <Link href="/algorithms" className="btn btn-secondary btn-lg">
            Procházet katalog
          </Link>
        </div>
      </section>
    </main>
  );
}
