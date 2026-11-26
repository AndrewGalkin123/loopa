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
import { Link } from "@/i18n/Link";
import { AlgorithmCard, type AlgorithmCardData } from "@/components/AlgorithmCard";
import { CompareDemo } from "@/components/landing/CompareDemo";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { hasTranslation, pick } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { LANDING } from "./texts/landing";
import "./landing.css";

/** The featured cards; their descriptions are in the texts of the language. */
const FEATURED: Omit<AlgorithmCardData, "description">[] = [
  {
    num: "01",
    group: "sorting",
    badge: { variant: "sorting", icon: ArrowUpNarrowWide, label: "sort" },
    title: "Bubble Sort",
    tagline: "simple",
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
    complexity: "O(n log n)",
    level: "intermediate",
    href: "/algorithms/quick-sort",
  },
  {
    num: "03",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    title: "Binary Search",
    tagline: "halve",
    complexity: "O(log n)",
    level: "beginner",
    href: "/algorithms/binary-search",
  },
  {
    num: "04",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitBranch, label: "bfs" },
    title: "Breadth-First",
    tagline: "ripples",
    complexity: "O(V + E)",
    level: "intermediate",
    href: "/algorithms/bfs",
  },
  {
    num: "05",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Route, label: "path" },
    title: "Dijkstra",
    tagline: "greedy",
    complexity: "O((V+E) log V)",
    level: "advanced",
    href: "/algorithms/dijkstra",
  },
  {
    num: "06",
    group: "optimization",
    badge: { variant: "optimization", icon: Grid3x3, label: "dp" },
    title: "Knapsack",
    tagline: "pack",
    complexity: "O(nW)",
    level: "advanced",
  },
];

/** The three features; their titles and texts are in the texts of the language. */
const FEATURES = [
  { icon: BookOpen, letter: "A", tag: "depth" },
  { icon: GitCompare, letter: "B", tag: "compare" },
  { icon: ShieldOff, letter: "C", tag: "focus" },
];

export default async function LandingPage() {
  const { t, locale } = await getTranslator();
  const text = pick(LANDING, locale);
  return (
    <main className="page-landing">
      {!hasTranslation(LANDING, locale) && <p className="untranslated">{t("untranslated")}</p>}
      {/* ───────── HERO ───────── */}
      <section className="hero">
        <div className="eyebrow">
          <span>▲ Interactive Algorithm Visualizer</span>
          <span className="v">· v1.0</span>
        </div>
        <h1>{text.hero.title}</h1>
        <p className="lede">{text.hero.lede}</p>
        <div className="hero-ctas">
          <Link href="/algorithms/bubble-sort" className="btn btn-primary">
            {text.hero.start} <ArrowRight size={14} />
          </Link>
          <Link href="/algorithms" className="btn btn-secondary">
            {text.hero.catalog}
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
            <h2>{text.explore.title}</h2>
            <p>{text.explore.text}</p>
          </div>
          <Link href="/algorithms" className="head-cta">
            {text.explore.all} <ArrowRight />
          </Link>
        </div>

        <div className="cards-grid">
          {FEATURED.map((card, i) => (
            <AlgorithmCard key={card.num} {...card} description={text.featured[i]} />
          ))}
        </div>
      </section>

      {/* ───────── 02 COMPARE ───────── */}
      <section>
        <div className="section-head">
          <div className="section-head-left">
            <div className="eyebrow">02 / Signature Feature</div>
            <h2>{text.compare.title}</h2>
            <p>{text.compare.text}</p>
          </div>
          <Link href="/compare" className="head-cta">
            {text.compare.open} <ArrowRight />
          </Link>
        </div>

        <div className="compare-shell">
          <CompareDemo />
          <div className="compare-shell-foot">
            <div className="label">
              running on identical input · <span className="accent">n = 16</span> · live
            </div>
            <Link href="/compare" className="btn btn-secondary btn-sm">
              {text.compare.openFull} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── 03 AI ───────── */}
      <section>
        <div className="section-head">
          <div className="section-head-left">
            <div className="eyebrow">03 / AI Powered</div>
            <h2>{text.ai.title}</h2>
            <p>{text.ai.text}</p>
          </div>
        </div>

        <div className="ai-grid">
          <div className="ai-copy">
            <ul className="ai-features">
              {text.ai.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <a href="#" className="btn btn-primary">
              {text.ai.tryIt} <ArrowRight size={14} />
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
              <div className="msg user">{text.ai.question1}</div>
              <div className="msg ai">
                <Sparkles className="spark" size={14} />
                <div>{text.ai.answer1}</div>
              </div>
              <div className="msg user">{text.ai.question2}</div>
              <div className="msg ai">
                <Sparkles className="spark" size={14} />
                <div>{text.ai.answer2}</div>
              </div>
            </div>
            <div className="input-row">
              <span>{text.ai.placeholder}</span>
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
            <h2>{text.forYou.title}</h2>
            <p>{text.forYou.text}</p>
          </div>
        </div>

        <div className="position-line">
          <div className="lhs">positioning</div>
          <div className="rhs">
            <s>{text.forYou.crossed}</s> &nbsp;→&nbsp; <b>{text.forYou.claim}</b>
          </div>
        </div>

        <div className="features-row">
          {FEATURES.map(({ icon: Icon, letter, tag }, i) => (
            <div className="feature" key={letter}>
              <div className="icon">
                <Icon size={18} />
              </div>
              <div className="num">
                <span className="accent">{letter}</span> / {tag}
              </div>
              <h3>
                {text.features[i].title} <em>{text.features[i].em}</em>
              </h3>
              <p>{text.features[i].text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="final-cta">
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          — Ready
        </div>
        <h2>{text.final.title}</h2>
        <p>{text.final.text}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/algorithms/bubble-sort" className="btn btn-primary btn-lg">
            {text.final.start} <ArrowRight size={16} />
          </Link>
          <Link href="/algorithms" className="btn btn-secondary btn-lg">
            {text.final.catalog}
          </Link>
        </div>
      </section>
    </main>
  );
}
