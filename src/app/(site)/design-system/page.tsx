import type { Metadata } from "next";
import {
  ArrowUp,
  ArrowUpNarrowWide,
  Check,
  ChevronDown,
  Copy,
  GitBranch,
  GitCompare,
  Grid3x3,
  Info,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Route,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { AlgorithmCard, type AlgorithmCardData } from "@/components/AlgorithmCard";
import { Badge } from "@/components/Badge";
import { BrandMark } from "@/components/BrandMark";
import { PlayToggle } from "@/components/design-system/PlayToggle";
import { TabGroup } from "@/components/design-system/TabGroup";
import { CODE_SAMPLE } from "./code";
import "./design-system.css";

export const metadata: Metadata = {
  title: "Loopa — Design System",
};

/* ───────── Data of the showcase sections ───────── */

interface Swatch {
  name: string;
  token: string;
  /** Text under the name; the token itself by default. */
  label?: string;
  style?: CSSProperties;
}

const PALETTES: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Surface · Text",
    swatches: [
      { name: "Background", token: "--color-bg" },
      { name: "Surface", token: "--color-surface" },
      { name: "Surface elevated", token: "--color-surface-elevated" },
      { name: "Border strong", token: "--color-border-strong" },
    ],
  },
  {
    title: "Accent",
    swatches: [
      { name: "Accent", token: "--color-accent" },
      { name: "Accent dim", token: "--color-accent-dim" },
      { name: "Accent glow", token: "--color-accent-glow", label: "rgba 15%", style: { backdropFilter: "blur(4px)" } },
      { name: "Text", token: "--color-text" },
    ],
  },
  {
    title: "Visualization",
    swatches: [
      { name: "Default", token: "--viz-default" },
      { name: "Active", token: "--viz-active" },
      { name: "Compared", token: "--viz-compared" },
      { name: "Sorted", token: "--viz-sorted" },
      { name: "Pivot", token: "--viz-pivot" },
      { name: "Visited", token: "--viz-visited" },
      { name: "Success", token: "--color-success" },
      { name: "Error", token: "--color-error" },
    ],
  },
];

const TYPE_SCALE: { meta: string; className: string; sample: ReactNode; spec: string; style?: CSSProperties }[] = [
  {
    meta: "Display 1 · Inter",
    className: "t-display-1",
    sample: <>Algoritmy, <em className="serif-i">vysvětlené</em></>,
    spec: "88 / 1 / −0.04em / 600",
  },
  {
    meta: "Display 2 · Inter",
    className: "t-display-2",
    sample: <>Bubble Sort, <em className="serif-i">simply</em></>,
    spec: "64 / 1 / −0.035em / 600",
  },
  { meta: "H1 · Inter", className: "t-h1", sample: "Compare two algorithms", spec: "48 / 1.05 / −0.03em / 600" },
  {
    meta: "H2 · Inter",
    className: "t-h2",
    sample: <>How <em className="serif-i">quicksort</em> partitions</>,
    spec: "32 / 1.1 / −0.02em / 600",
  },
  { meta: "H3 · Inter", className: "t-h3", sample: "Step 7 — comparing indices", spec: "24 / 1.2 / −0.015em / 500" },
  { meta: "H4 · Inter", className: "t-h4", sample: "Implementation notes", spec: "20 / 1.3 / −0.01em / 500" },
  {
    meta: "Body Large · Inter",
    className: "t-lg",
    sample: "The quicksort algorithm partitions an array around a chosen pivot, then recurses into each half.",
    spec: "18 / 1.5 / 400",
  },
  {
    meta: "Body · Inter",
    className: "t-base",
    sample: "A stable, in-place comparison sort that compares adjacent elements and swaps them if they are out of order.",
    spec: "15 / 1.5 / 400",
  },
  {
    meta: "Small · Inter",
    className: "t-sm",
    sample: "Best understood by watching the values cascade upward, pass after pass.",
    spec: "13 / 1.5 / 400",
  },
  {
    meta: "XS · Inter",
    className: "t-xs",
    sample: "Updated on 7 June 2026",
    spec: "11 / 1.4 / 500",
    style: { textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)" },
  },
  { meta: "Mono Large", className: "t-mono-lg", sample: "function bubbleSort(arr) { … }", spec: "16 mono / 1.4" },
  { meta: "Mono Base", className: "t-mono-base", sample: "cmp: 14 · swp: 7 · elapsed 0.42s", spec: "14 mono / 1.4" },
  {
    meta: "Mono Small",
    className: "t-mono-sm",
    sample: "step 07 / 24 — comparing [3] [4]",
    spec: "12 mono / 1.4",
    style: { color: "var(--color-text-subtle)", textTransform: "uppercase" },
  },
];

/** Spacing tokens: --space-N is N × 4 px. */
const SPACING = [1, 2, 3, 4, 6, 8, 12, 16, 24];

const RADII = [
  { name: "sm", px: 4 },
  { name: "md", px: 6 },
  { name: "lg", px: 8 },
  { name: "xl", px: 12 },
];

const CARDS: AlgorithmCardData[] = [
  {
    num: "01",
    group: "sorting",
    badge: { variant: "sorting", icon: ArrowUpNarrowWide, label: "sort" },
    title: "Bubble Sort",
    tagline: "simple",
    description: "Jednoduchý algoritmus třídění. Ideální pro pochopení principů porovnání a výměn sousedních prvků.",
    complexity: "O(n²)",
    level: "beginner",
  },
  {
    num: "02",
    group: "sorting",
    badge: { variant: "sorting", icon: Zap, label: "fast" },
    title: "Quicksort",
    tagline: "divide",
    description:
      "Rozděl a panuj. Volí pivot a rekurzivně třídí dvě poloviny. Mistr v praxi, choulostivý v nejhorším případě.",
    complexity: "O(n log n)",
    level: "intermediate",
  },
  {
    num: "03",
    group: "graph-traversal",
    badge: { variant: "graph", icon: GitBranch, label: "bfs" },
    title: "Breadth-First",
    tagline: "ripples",
    description: "Prochází graf vrstvu po vrstvě jako vlna na hladině. Najde nejkratší cestu v neváženém grafu.",
    complexity: "O(V + E)",
    level: "intermediate",
  },
  {
    num: "04",
    group: "shortest-path",
    badge: { variant: "shortest", icon: Route, label: "path" },
    title: "Dijkstra",
    tagline: "greedy",
    description: "Najde nejkratší cestu z jednoho zdroje ve váženém grafu s nezápornými hranami. Hladová strategie.",
    complexity: "O((V+E) log V)",
    level: "advanced",
  },
  {
    num: "05",
    group: "search-sorted",
    badge: { variant: "search-sorted", icon: Search, label: "bin" },
    title: "Binary Search",
    tagline: "halve",
    description: "Vyhledávání v seřazeném poli. V každém kroku zahodí polovinu prostoru. Logaritmické.",
    complexity: "O(log n)",
    level: "beginner",
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

/** Bars of the demo player: [state class, height in px, value]. */
const PLAYER_BARS: [string, number, number][] = [
  ["sorted", 32, 5],
  ["sorted", 48, 8],
  ["sorted", 64, 11],
  ["compared", 96, 17],
  ["active", 128, 23],
  ["pivot", 80, 14],
  ["", 112, 19],
  ["", 56, 9],
  ["", 104, 21],
  ["", 40, 7],
  ["", 72, 13],
  ["", 88, 16],
];

const BAR_STATES = ["default", "active", "compared", "sorted", "pivot", "visited"];

const CURRENT_CODE_LINE = 5;

function BlockHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className="block-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <p>{children}</p>
    </div>
  );
}

const MONO_DIM: CSSProperties = { fontSize: "11px", color: "var(--color-text-dim)" };

export default function DesignSystemPage() {
  return (
    <main className="page-design-system">
      {/* ───────── HERO ───────── */}
      <section className="hero">
        <div className="eyebrow">v1.0 / Design System</div>
        <h1>
          Components, <em>composed</em> with intent.
        </h1>
        <p>
          The complete kit for Loopa — tokens, type, and every primitive used across the platform. Toggle the theme in
          the top right to inspect both modes.
        </p>
      </section>

      {/* ───────── 01 COLORS ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="01 / Color System"
          title={
            <>
              Palette &amp; <em>semantics</em>
            </>
          }
        >
          Hierarchy through surfaces and borders — not shadow. Lime accents only for primary actions and active states.
        </BlockHead>

        {PALETTES.map((palette) => (
          <div className="palette-row" key={palette.title}>
            <p className="subhead">{palette.title}</p>
            <div className="palette">
              {palette.swatches.map((swatch) => (
                <div className="swatch" key={swatch.name}>
                  <div className="swatch-fill" style={{ background: `var(${swatch.token})`, ...swatch.style }} />
                  <div className="swatch-body">
                    <div className="swatch-name">{swatch.name}</div>
                    <div className="swatch-hex mono">{swatch.label ?? swatch.token}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ───────── 02 TYPE ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="02 / Typography"
          title={
            <>
              Three voices, <em>one rhythm</em>
            </>
          }
        >
          Inter speaks UI. Instrument Serif speaks emotion, in italic only. JetBrains Mono speaks the machine.
        </BlockHead>

        <div>
          {TYPE_SCALE.map((row) => (
            <div className="type-row" key={row.meta}>
              <div className="type-meta">{row.meta}</div>
              <div className={row.className} style={row.style}>
                {row.sample}
              </div>
              <div className="type-spec">{row.spec}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── 03 SPACING & RADII ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="03 / Spacing & Radii"
          title={
            <>
              The <em>4-pixel</em> grid
            </>
          }
        >
          Every gap, every padding, every radius is a multiple of four. Form is consequence, not decoration.
        </BlockHead>

        <div className="grid-2">
          <div className="demo">
            <div className="demo-label">Spacing scale</div>
            {SPACING.map((step) => (
              <div className="scale-row" key={step}>
                <span className="lbl">--space-{step}</span>
                <span className="bar2" style={{ width: `${step * 4}px` }} />
                <span className="mono" style={MONO_DIM}>
                  {step * 4}
                </span>
              </div>
            ))}
          </div>
          <div className="demo">
            <div className="demo-label">Radii</div>
            <div className="radii">
              {RADII.map((radius) => (
                <div className="radius-sample" key={radius.name} style={{ borderRadius: `var(--radius-${radius.name})` }}>
                  {radius.name} · {radius.px}
                </div>
              ))}
            </div>
            <p className="mono" style={{ fontSize: "11px", color: "var(--color-text-subtle)", marginTop: "24px" }}>
              No 16–24px corners. Everything stays crisp.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── 04 BUTTONS ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="04 / Buttons"
          title={
            <>
              Primary, secondary, <em>ghost</em>
            </>
          }
        >
          One lime per page. Everything else holds its weight in border and surface.
        </BlockHead>

        <div className="grid-2">
          <div className="demo">
            <div className="demo-label">Variants</div>
            <div className="btn-row" style={{ marginBottom: "20px" }}>
              <button className="btn btn-primary">
                <Play size={14} /> Run algorithm
              </button>
              <button className="btn btn-secondary">Compare two</button>
              <button className="btn btn-ghost">about</button>
            </div>
            <div className="btn-row">
              <button className="btn btn-primary">
                <Sparkles size={14} /> Ask AI <span className="kbd">⌘K</span>
              </button>
              <button className="btn btn-secondary">
                <GitCompare size={14} /> Open compare
              </button>
            </div>
          </div>

          <div className="demo">
            <div className="demo-label">Sizes · sm 32 / md 40 / lg 48</div>
            <div className="btn-row" style={{ marginBottom: "20px" }}>
              <button className="btn btn-primary btn-sm">Step</button>
              <button className="btn btn-primary">Step</button>
              <button className="btn btn-primary btn-lg">Step</button>
            </div>
            <div className="btn-row">
              <button className="btn btn-secondary btn-sm">Reset</button>
              <button className="btn btn-secondary">Reset</button>
              <button className="btn btn-secondary btn-lg">Reset</button>
            </div>
          </div>

          <div className="demo">
            <div className="demo-label">States</div>
            <div className="btn-row">
              <button className="btn btn-primary">Default</button>
              <button
                className="btn btn-primary"
                style={{ filter: "brightness(1.1)", boxShadow: "0 0 24px var(--color-accent-glow)" }}
              >
                Hover
              </button>
              <button className="btn btn-primary" style={{ filter: "brightness(0.95)" }}>
                Active
              </button>
              <button className="btn btn-primary" disabled>
                Disabled
              </button>
              <button className="btn btn-primary">
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading
              </button>
            </div>
          </div>

          <div className="demo">
            <div className="demo-label">Icon-only · sm 32 / md 40 / lg 48</div>
            <div className="btn-row">
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Reset">
                <RotateCcw size={14} />
              </button>
              <button className="btn btn-secondary btn-icon" aria-label="Pause">
                <Pause size={16} />
              </button>
              <button className="btn btn-primary btn-icon btn-lg" aria-label="Play">
                <Play size={18} />
              </button>
              <button className="btn btn-secondary btn-icon" aria-label="Forward">
                <SkipForward size={16} />
              </button>
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Copy">
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 05 INPUTS ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="05 / Inputs"
          title={
            <>
              Quiet fields, <em>precise</em> focus
            </>
          }
        >
          40px height across the family. Focus moves the border to lime — no glow, no halo, no nonsense.
        </BlockHead>

        <div className="grid-2">
          <div className="demo">
            <div className="demo-label">Text · Search · Select</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="input">
                <input type="text" placeholder="Algorithm name" defaultValue="Quicksort" />
              </div>
              <div className="input">
                <Search size={16} />
                <input type="text" placeholder="Search algorithms…" />
                <span className="kbd-inline">⌘K</span>
              </div>
              <div className="select">
                <span className="select-text" style={{ color: "var(--color-text)" }}>
                  Language &nbsp;·&nbsp; <span style={{ color: "var(--color-text-muted)" }}>JavaScript</span>
                </span>
                <ChevronDown size={16} style={{ marginLeft: "auto" }} />
              </div>
              <div className="select is-focus">
                <span className="select-text" style={{ color: "var(--color-text-subtle)" }}>
                  Category
                </span>
                <ChevronDown size={16} style={{ marginLeft: "auto" }} />
              </div>
            </div>
          </div>

          <div className="demo">
            <div className="demo-label">Slider</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <span className="mono" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                array size
              </span>
              <span className="mono" style={{ fontSize: "14px", color: "var(--color-text)" }}>
                n = 24
              </span>
            </div>
            <input type="range" min="5" max="50" defaultValue={24} className="slider" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--color-text-dim)" }}>
                5
              </span>
              <span className="mono" style={{ fontSize: "10px", color: "var(--color-text-dim)" }}>
                50
              </span>
            </div>

            <div style={{ height: "24px" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <span className="mono" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                playback speed
              </span>
              <span className="mono" style={{ fontSize: "14px", color: "var(--color-text)" }}>
                1.0×
              </span>
            </div>
            <input type="range" min="0" max="4" step="1" defaultValue={2} className="slider" />
          </div>
        </div>
      </section>

      {/* ───────── 06 TABS ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="06 / Tabs"
          title={
            <>
              Underline, <em>not</em> pills
            </>
          }
        >
          Editorial in feel. Active state earns a 2px lime line.
        </BlockHead>
        <div className="demo">
          <div className="demo-label">Section navigation</div>
          <TabGroup
            className="tabs"
            itemClassName="tab"
            items={[
              { label: "Description" },
              { label: "Pseudocode" },
              { label: "Implementation" },
              { label: "Complexity" },
              { label: "References" },
            ]}
          />
        </div>
      </section>

      {/* ───────── 07 ALGORITHM CARDS ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="07 / Algorithm Cards"
          title={
            <>
              The <em>catalog</em> primitive
            </>
          }
        >
          Dense, borderless of shadow, hover lifts surface only. Footer holds complexity and level in monospace.
        </BlockHead>

        <div className="grid-3">
          {CARDS.map((card) => (
            <AlgorithmCard key={card.num} {...card} />
          ))}
        </div>

        <div style={{ height: "28px" }} />
        <p className="subhead">Category badges</p>
        <div className="btn-row">
          <Badge variant="sorting" icon={ArrowUpNarrowWide}>
            sorting
          </Badge>
          <Badge variant="search-sorted" icon={Search}>
            search-sorted
          </Badge>
          <Badge variant="graph" icon={GitBranch}>
            graph-traversal
          </Badge>
          <Badge variant="shortest" icon={Route}>
            shortest-path
          </Badge>
          <Badge variant="optimization" icon={Grid3x3}>
            optimization
          </Badge>
        </div>
      </section>

      {/* ───────── 08 PLAYER ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="08 / Player"
          title={
            <>
              The <em>conductor</em>
            </>
          }
        >
          The single component every algorithm page revolves around. Header reports state, controls drive it, the bar
          tracks progress in discrete ticks.
        </BlockHead>

        <div className="player">
          <div className="player-head">
            <div className="player-title">
              Bubble Sort{" "}
              <span className="mono" style={{ color: "var(--color-text-subtle)", fontSize: "12px", marginLeft: "8px" }}>
                — random input, n=12
              </span>
            </div>
            <div className="player-status">
              step <span className="accent">07</span> / 24 &nbsp;—&nbsp; comparing [3] [4]
            </div>
          </div>
          <div className="player-body">
            <div className="viz">
              {PLAYER_BARS.map(([state, height, value], i) => (
                <div key={i} className={state ? `bar ${state}` : "bar"} style={{ height: `${height}px` }}>
                  <span className="bar-label">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="player-progress" aria-hidden="true">
            <div className="player-progress-fill" style={{ width: "29%" }} />
            <div className="player-progress-ticks">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
          <div className="player-controls">
            <div className="controls-left">
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Reset">
                <RotateCcw size={14} />
              </button>
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Step back">
                <SkipBack size={14} />
              </button>
              <PlayToggle />
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Step forward">
                <SkipForward size={14} />
              </button>
            </div>
            <div className="controls-right">
              <button className="speed-chip">
                <span className="lbl">speed</span> 1.0× <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
              </button>
              <button className="size-chip">
                <span className="lbl">array</span> n=12 <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
              </button>
            </div>
          </div>
        </div>

        <p className="subhead" style={{ marginTop: "32px" }}>
          Viz legend — bar states
        </p>
        <div className="btn-row">
          {BAR_STATES.map((state) => (
            <span key={state} style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <span style={{ width: "14px", height: "14px", background: `var(--viz-${state})`, borderRadius: "2px" }} />{" "}
              {state}
            </span>
          ))}
        </div>
      </section>

      {/* ───────── 09 METRICS ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="09 / Metrics Display"
          title={
            <>
              Counters in <em>tabular</em> mono
            </>
          }
        >
          Tabular numerals so values don&apos;t jitter as they climb. Label up, value down.
        </BlockHead>

        <div className="grid-2">
          <div className="demo">
            <div className="demo-label">Horizontal</div>
            <div className="metrics">
              <div className="metric">
                <span className="k">cmp</span>
                <span className="v">14</span>
              </div>
              <div className="metric">
                <span className="k">swp</span>
                <span className="v">07</span>
              </div>
              <div className="metric accent">
                <span className="k">elapsed</span>
                <span className="v">0.42s</span>
              </div>
              <div className="metric">
                <span className="k">step</span>
                <span className="v">07 / 24</span>
              </div>
            </div>
          </div>
          <div className="demo">
            <div className="demo-label">Vertical</div>
            <div className="metrics metrics-vert" style={{ display: "flex" }}>
              <div className="metric">
                <span className="k">comparisons</span>
                <span className="v">2 481</span>
              </div>
              <div className="metric">
                <span className="k">swaps</span>
                <span className="v">1 237</span>
              </div>
              <div className="metric accent">
                <span className="k">total time</span>
                <span className="v">3.18s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 10 CODE BLOCK ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="10 / Code Blocks"
          title={
            <>
              Pseudocode &amp; <em>implementations</em>
            </>
          }
        >
          The active line aligns with the player&apos;s step. A lime left rail and a faint tinted background tell you
          where the algorithm is right now.
        </BlockHead>

        <div className="code">
          <TabGroup
            className="code-tabs"
            itemClassName="code-tab"
            items={[
              { label: "JavaScript" },
              { label: "Python" },
              { label: "Java" },
              { label: "pseudocode", style: { marginLeft: "auto", color: "var(--color-text-dim)" } },
            ]}
          />
          <button className="code-copy" aria-label="Copy">
            <Copy size={14} />
          </button>
          <pre className="code-body" style={{ margin: 0 }}>
            {CODE_SAMPLE.map((line, i) => (
              <div key={i} className={i + 1 === CURRENT_CODE_LINE ? "code-line is-current" : "code-line"}>
                <span className="ln">{i + 1}</span>
                <span>{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </section>

      {/* ───────── 11 OVERLAYS ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="11 / Overlays"
          title={
            <>
              Modals, toasts, <em>tooltips</em>
            </>
          }
        >
          Used sparingly. Modals are the only place where shadow is allowed to land.
        </BlockHead>

        <div className="grid-2">
          <div className="modal-shell">
            <div className="modal">
              <div className="modal-head">
                <h3>Reset visualization?</h3>
                <button className="icon-btn-mini" aria-label="Close">
                  <X size={14} />
                </button>
              </div>
              <div className="modal-body">
                Resetting will discard the current step and regenerate input. Your speed and array-size settings will be
                preserved.
              </div>
              <div className="modal-foot">
                <button className="btn btn-secondary btn-sm">Cancel</button>
                <button className="btn btn-primary btn-sm">Reset</button>
              </div>
            </div>
          </div>

          <div className="demo">
            <div className="demo-label">Toast</div>
            <div style={{ marginBottom: "24px" }}>
              <div className="toast">
                <Check size={14} />
                <span>Code copied to clipboard</span>
                <X className="x" size={14} />
              </div>
            </div>
            <div>
              <div className="toast">
                <Info size={14} style={{ color: "var(--color-info)" }} />
                <span>Switched to comparison mode</span>
                <X className="x" size={14} />
              </div>
            </div>

            <div className="demo-label" style={{ marginTop: "32px" }}>
              Tooltip
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Reset">
                <RotateCcw size={14} />
              </button>
              <span className="tooltip">
                Reset ·{" "}
                <span className="mono" style={{ color: "var(--color-text-subtle)" }}>
                  R
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 12 AI CHAT PANEL ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="12 / AI Assistant"
          title={
            <>
              A panel that <em>knows</em> the algorithm
            </>
          }
        >
          Slides in from the right. Grounded on verified material — never inventing complexity bounds or step counts.
        </BlockHead>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="chat">
            <div className="chat-head">
              <div>
                <div className="lbl">AI Assistant</div>
                <div className="sub">
                  asks about <span style={{ color: "var(--color-text-muted)" }}>bubble sort</span>
                </div>
              </div>
              <button className="icon-btn-mini" aria-label="Close">
                <X size={14} />
              </button>
            </div>
            <div className="chat-body">
              <div className="msg user">Proč se bubble sort nazývá &quot;bubble&quot;?</div>
              <div className="msg ai">
                <Sparkles className="spark" size={14} />
                <div>
                  Větší prvky postupně „probublávají&quot; ke konci pole — v každém průchodu se největší zbývající
                  hodnota usadí na své finální místo, podobně jako vzduchová bublina stoupající k hladině.
                </div>
              </div>
              <div className="msg user">A nejhorší případ?</div>
              <div className="msg ai">
                <Sparkles className="spark" size={14} />
                <div>
                  O(n²) — když je vstup seřazen sestupně. Tehdy provede{" "}
                  <span className="mono" style={{ color: "var(--color-text)" }}>
                    n(n−1)/2
                  </span>{" "}
                  porovnání a stejný počet výměn.
                </div>
              </div>
            </div>
            <div className="chat-input">
              <div className="chat-input-row">
                <textarea rows={1} placeholder="Zeptej se na cokoli o tomto algoritmu…" />
                <button className="chat-send" aria-label="Send">
                  <ArrowUp size={14} />
                </button>
              </div>
              <div className="chat-foot">
                <span>14 messages left today</span>
                <span>↵ to send · ⇧↵ for newline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 13 NAV + FOOTER ───────── */}
      <section className="block">
        <BlockHead
          eyebrow="13 / Page Shell"
          title={
            <>
              Header &amp; <em>footer</em>
            </>
          }
        >
          The page chrome is on every screen — it&apos;s already mounted at the top of this document. Below: the footer.
        </BlockHead>

        <div className="demo" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              borderBottom: "1px solid var(--color-border)",
              height: "64px",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              gap: "32px",
              background: "var(--color-surface)",
            }}
          >
            <div className="brand">
              <BrandMark />
              <span>Loopa</span>
            </div>
            <div className="nav-links" style={{ display: "flex", gap: "24px" }}>
              <a href="#" className="active">
                Algorithms
              </a>
              <a href="#">Compare</a>
              <a href="#">About</a>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
              <button className="btn btn-secondary btn-sm">
                <Search size={14} /> Search <span className="kbd-inline">⌘K</span>
              </button>
              <button className="btn btn-ghost btn-sm">
                CS <ChevronDown size={12} />
              </button>
            </div>
          </div>
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--color-text-subtle)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "12px",
            }}
          >
            — page content —
          </div>
        </div>
      </section>
    </main>
  );
}
