import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpNarrowWide,
  Check,
  ChevronDown,
  Pause,
  RotateCcw,
  Settings2,
  Shuffle,
  SkipBack,
  SkipForward,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AiFab } from "@/components/AiFab";
import { Badge } from "@/components/Badge";
import { Dropdown } from "@/components/Dropdown";
import { VizBars } from "@/components/VizBars";
import { pad } from "@/lib/demoSteps";
import { mulberry32, seedFrom, seededShuffle } from "@/lib/random";
import "./compare.css";

export const metadata: Metadata = {
  title: "Bubble Sort ✕ Quick Sort — Compare — Loopa",
};

/*
 * The comparison is not interactive yet. It shows a frozen moment, computed
 * with the same formulas as the design's script: Quick Sort has finished,
 * Bubble Sort is at 85 % of its run.
 */
const N = 28;
const DATASET = "nearly";
const BUBBLE_PROGRESS = 85; // %
const BUBBLE_TOTAL_STEPS = 105;
const QUICK = { cmp: 12, swp: 4, ops: 24 };

function frozenState() {
  const random = mulberry32(seedFrom(`${DATASET}:${N}`));
  const values = Array.from({ length: N }, (_, i) => i + 1);

  // The largest values have already bubbled up to the right; the rest is still shuffled.
  const settled = Math.min(N - 3, Math.max(2, Math.round((BUBBLE_PROGRESS / 100) * 6)));
  const sortedFrom = N - settled;
  const bubbleValues = [...seededShuffle(values.slice(0, sortedFrom), random), ...values.slice(sortedFrom)];
  const comparing = Math.floor(sortedFrom / 2) - 1; // compares [comparing] and [comparing + 1]

  const step = Math.round((BUBBLE_PROGRESS / 100) * BUBBLE_TOTAL_STEPS);
  const cmp = step;
  const swp = Math.round(step * 0.49);
  return {
    quickValues: values,
    bubbleValues,
    sortedFrom,
    comparing,
    step,
    cmp,
    swp,
    ops: cmp + swp,
    time: ((BUBBLE_PROGRESS / 100) * 2.3).toFixed(2),
  };
}

/** "−87%": how much less work Quick Sort did. */
const percentLess = (less: number, more: number) => `−${Math.round((1 - less / more) * 100)}%`;

function MetricRow({ name, sub, bubble, quick, diff }: {
  name: string;
  sub: string;
  bubble: ReactNode;
  quick: ReactNode;
  diff: ReactNode;
}) {
  return (
    <div className="row">
      <span className="metric-name">
        {name}
        <span className="sub">{sub}</span>
      </span>
      <span className="num">{bubble}</span>
      <span className="num muted">{quick}</span>
      <span className="diff">{diff}</span>
    </div>
  );
}

export default function ComparePage() {
  const s = frozenState();

  return (
    <>
      <main className="page-compare">
        {/* COMPARE HEADER (sticky) */}
        <section className="compare-head">
          <div className="crumbs">
            <Link href="/algorithms">algorithms</Link>
            <span className="sep">/</span>
            <span className="here">compare</span>
          </div>
          <div className="head-row">
            <div>
              <h1>
                Bubble Sort <span className="x">✕</span> Quick Sort
              </h1>
              <p className="sub">
                Stejná data. <em>Různé strategie.</em>
              </p>
            </div>
            <div className="head-actions">
              <button className="btn btn-secondary" aria-label="Nastavení dat">
                <Settings2 size={15} /> Nastavení dat
              </button>
              <Dropdown
                wrapClassName="swap-wrap"
                buttonClassName="btn btn-secondary"
                menuClassName="swap-menu"
                label={
                  <>
                    Změnit algoritmy <ChevronDown size={14} />
                  </>
                }
              >
                <div className="grp">slot A — sorting</div>
                <a href="#" className="cur">
                  Bubble Sort <span className="c">O(n²)</span>
                </a>
                <a href="#">
                  Selection Sort <span className="c">O(n²)</span>
                </a>
                <a href="#">
                  Insertion Sort <span className="c">O(n²)</span>
                </a>
                <div className="divline" />
                <div className="grp">slot B — sorting</div>
                <a href="#" className="cur">
                  Quick Sort <span className="c">O(n log n)</span>
                </a>
                <a href="#">
                  Merge Sort <span className="c">O(n log n)</span>
                </a>
                <a href="#">
                  Heap Sort <span className="c">O(n log n)</span>
                </a>
              </Dropdown>
            </div>
          </div>
        </section>

        {/* DUO VISUALIZATION */}
        <section className="compare-stage">
          <div className="duo">
            <div className="duo-grid">
              {/* LEFT: Bubble (running) */}
              <div className="col left">
                <div className="col-head">
                  <div className="l">
                    <div className="name-row">
                      <span className="name">
                        Bubble Sort <em>— simple</em>
                      </span>
                      <Badge variant="sorting" icon={ArrowUpNarrowWide}>
                        sort
                      </Badge>
                    </div>
                    <span className="status running">
                      <span className="ic" /> running
                    </span>
                  </div>
                </div>
                <div className="stage">
                  <VizBars
                    values={s.bubbleValues}
                    classOf={(i) =>
                      i >= s.sortedFrom ? "sorted" : i === s.comparing || i === s.comparing + 1 ? "compared" : ""
                    }
                  />
                </div>
                <div className="col-progress">
                  <div className="fill running" style={{ width: `${BUBBLE_PROGRESS}%` }} />
                </div>
                <div className="col-metrics">
                  <div className="metric">
                    <span className="k">cmp</span>
                    <span className="v">{pad(s.cmp)}</span>
                  </div>
                  <div className="metric">
                    <span className="k">swp</span>
                    <span className="v">{pad(s.swp)}</span>
                  </div>
                  <div className="metric">
                    <span className="k">elapsed</span>
                    <span className="v">{s.time}s</span>
                  </div>
                </div>
                <div className="step-row">
                  <span>
                    step <span className="accent">{s.step}</span> / {BUBBLE_TOTAL_STEPS}
                  </span>
                  <span>
                    comparing [{s.comparing}] [{s.comparing + 1}]
                  </span>
                </div>
              </div>

              <div className="divider" />

              {/* RIGHT: Quick (done) */}
              <div className="col right">
                <div className="col-head">
                  <div className="l">
                    <div className="name-row">
                      <span className="name">
                        Quick Sort <em>— divide</em>
                      </span>
                      <Badge variant="sorting" icon={Zap}>
                        fast
                      </Badge>
                    </div>
                    <span className="status done">
                      <Check /> done
                    </span>
                  </div>
                </div>
                <div className="stage">
                  <VizBars values={s.quickValues} classOf={() => "sorted"} />
                </div>
                <div className="col-progress">
                  <div className="fill done" style={{ width: "100%" }} />
                </div>
                <div className="col-metrics">
                  <div className="metric frozen">
                    <span className="k">cmp</span>
                    <span className="v">{pad(QUICK.cmp)}</span>
                  </div>
                  <div className="metric frozen">
                    <span className="k">swp</span>
                    <span className="v">{pad(QUICK.swp)}</span>
                  </div>
                  <div className="metric frozen">
                    <span className="k">elapsed</span>
                    <span className="v">0.40s</span>
                  </div>
                </div>
                <div className="step-row">
                  <span>
                    step <span className="done-c">24</span> / 24
                  </span>
                  <span className="done-c">✓ seřazeno · čeká</span>
                </div>
              </div>
            </div>
          </div>

          {/* UNIFIED PLAYER */}
          <div className="unified-player">
            <div className="up-controls">
              <div className="up-left">
                <button className="btn btn-secondary btn-icon btn-sm" aria-label="Reset">
                  <RotateCcw size={14} />
                </button>
                <button className="btn btn-secondary btn-icon btn-sm" aria-label="Krok zpět">
                  <SkipBack size={14} />
                </button>
                <button className="btn btn-primary btn-icon" aria-label="Pauza">
                  <Pause size={16} />
                </button>
                <button className="btn btn-secondary btn-icon btn-sm" aria-label="Krok vpřed">
                  <SkipForward size={14} />
                </button>
              </div>
              <div className="up-center">
                {/* The shared bar follows the slower algorithm (Bubble Sort). */}
                <div className="up-progress" title="společný postup">
                  <div className="fill" style={{ width: `${BUBBLE_PROGRESS}%` }} />
                  <div className="marker" style={{ left: "100%" }} title="Quick Sort dokončil" />
                  <div className="handle" style={{ left: `${BUBBLE_PROGRESS}%` }} />
                </div>
              </div>
              <div className="up-right">
                <button className="chip-control">
                  <span className="lbl">speed</span> 1.0× <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
                </button>
                <button className="chip-control">
                  <span className="lbl">array</span> n=20 <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
                </button>
              </div>
            </div>
            <div className="up-hint">
              <span className="c">{"//"}</span> oba algoritmy běží na&nbsp;stejných datech <span className="c">·</span>{" "}
              <span className="accent">plays at fixed ops/sec</span> <span className="c">·</span> Quick Sort dokončil
              ve&nbsp;step 24
            </div>
          </div>
        </section>

        {/* LIVE METRICS */}
        <section className="metrics-section">
          <div className="ms-head">
            <div className="section-marker">live metrics</div>
            <h2>
              Reálný rozdíl <em>v číslech</em>
            </h2>
          </div>

          <div className="mtable">
            <div className="row header">
              <span className="h">metrika</span>
              <span className="h algo">Bubble Sort</span>
              <span className="h algo">Quick Sort</span>
              <span className="h">difference</span>
            </div>
            <MetricRow
              name="Comparisons"
              sub="porovnání"
              bubble={s.cmp}
              quick={QUICK.cmp}
              diff={
                <>
                  <ArrowDown /> {percentLess(QUICK.cmp, s.cmp)} <span className="tag">méně</span>
                </>
              }
            />
            <MetricRow
              name="Swaps"
              sub="výměny"
              bubble={s.swp}
              quick={QUICK.swp}
              diff={
                <>
                  <ArrowDown /> {percentLess(QUICK.swp, s.swp)} <span className="tag">méně</span>
                </>
              }
            />
            <MetricRow
              name="Operations"
              sub="operace celkem"
              bubble={s.ops}
              quick={QUICK.ops}
              diff={
                <>
                  <Zap /> {(s.ops / QUICK.ops).toFixed(1)}× <span className="tag">rychlejší</span>
                </>
              }
            />
            <MetricRow
              name="Time at 1×"
              sub="čas při 1×"
              bubble="2.3s"
              quick="0.4s"
              diff={
                <>
                  <Zap /> 5.8× <span className="tag">rychlejší</span>
                </>
              }
            />
          </div>
        </section>

        {/* INSIGHT */}
        <section style={{ paddingBottom: "8px" }}>
          <div className="insight">
            <div className="label">— result</div>
            <p>
              Quick Sort dokončil za&nbsp;<span className="mono-n">24</span> operací. Bubble Sort potřeboval{" "}
              <span className="mono-n">105</span> — <em>4.4× více</em>.
            </p>
            <p className="dim">
              Při poli velikosti{" "}
              <span className="mono-n" style={{ color: "var(--color-text)" }}>
                ~1000
              </span>{" "}
              očekávej, že Quick Sort bude přibližně{" "}
              <span className="mono-n" style={{ color: "var(--color-text)" }}>
                50×
              </span>{" "}
              rychlejší. Rozdíl mezi O(n²) a&nbsp;O(n log n) roste s&nbsp;velikostí vstupu — na&nbsp;malém poli skoro
              neznatelný, na&nbsp;velkém propastný.
            </p>
            <div className="actions">
              <button className="btn btn-primary">
                Porovnat s&nbsp;Merge Sort <ArrowRight size={14} />
              </button>
              <button className="btn btn-secondary">
                <Shuffle size={14} /> Zkusit s&nbsp;jinými daty
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING AI */}
      <AiFab label="Zeptej se na&nbsp;porovnání" ariaLabel="Zeptej se na porovnání" />
    </>
  );
}
