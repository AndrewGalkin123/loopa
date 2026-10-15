import type { Metadata } from "next";
import { Activity, ArrowRight, BarChart2, ChevronDown, Clock, MousePointerClick } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALGORITHMS, getAlgorithm } from "@/algorithms";
import type { BarState } from "@/algorithms/types";
import { AiFab } from "@/components/AiFab";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { CodeTabs } from "@/components/algorithm/CodeTabs";
import { ContentTabs } from "@/components/algorithm/ContentTabs";
import { Pseudocode } from "@/components/algorithm/Pseudocode";
import { Badge } from "@/components/Badge";
import { Dropdown } from "@/components/Dropdown";
import { InputPanel } from "@/components/player/InputPanel";
import { Player } from "@/components/player/Player";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { StepStatus } from "@/components/player/StepStatus";
import "./algorithm.css";

/*
 * One template for every algorithm page: /algorithms/bubble-sort, later
 * /algorithms/quick-sort … The texts and code come from src/algorithms/<slug>/.
 */

type Props = { params: Promise<{ slug: string }> };

// Pages are generated at build time for every known algorithm; other slugs give 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return ALGORITHMS.map((algorithm) => ({ slug: algorithm.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const algorithm = getAlgorithm((await params).slug);
  return { title: algorithm ? `${algorithm.name} — Loopa` : "Loopa" };
}

const CONTENT_TABS = [
  { id: "popis", label: "Popis" },
  { id: "pseudokod", label: "Pseudokód" },
  { id: "implementace", label: "Implementace" },
  { id: "slozitost", label: "Složitost" },
];

/** Legend entries for every bar state; each algorithm lists the states it uses. */
const LEGEND: Record<BarState, { color: string; desc: string; dim?: boolean }> = {
  default: { color: "var(--viz-default)", desc: "neaktivní" },
  active: { color: "var(--viz-active)", desc: "právě teď" },
  compared: { color: "var(--viz-compared)", desc: "porovnání" },
  pivot: { color: "var(--viz-pivot)", desc: "pivot" },
  sorted: { color: "var(--viz-sorted)", desc: "hotovo" },
  dimmed: { color: "var(--viz-default)", desc: "mimo úsek", dim: true },
};

export default async function AlgorithmPage({ params }: Props) {
  const algorithm = getAlgorithm((await params).slug);
  if (!algorithm) notFound();

  return (
    <PlayerProvider slug={algorithm.slug} initialInput={algorithm.initialInput}>
      <div className="page-algorithm">
        {/* ───────── SECOND-LEVEL STICKY ───────── */}
        <div className="subnav">
          <div className="subnav-inner">
            <div className="crumbs">
              <Link href="/algorithms">algorithms</Link>
              <span className="sep">/</span>
              <a href="#">{algorithm.group}</a>
            </div>
            <div className="algo-name">
              <span>{algorithm.name}</span>
              <Badge variant={algorithm.badge.variant} icon={algorithm.badge.icon}>
                {algorithm.badge.label}
              </Badge>
            </div>
            <div className="subnav-right">
              <StepStatus />
              <button className="btn btn-secondary btn-sm">
                Porovnat <ChevronDown size={13} />
              </button>
            </div>
          </div>
        </div>

        <main>
          {/* ───────── ALGO HERO ───────── */}
          <section className="algo-hero">
            <div className="top-row">
              <div className="crumbs">
                <Link href="/">home</Link>
                <span className="sep">/</span>
                <Link href="/algorithms">algorithms</Link>
                <span className="sep">/</span>
                <a href="#">{algorithm.group}</a>
                <span className="sep">/</span>
                <span className="here">{algorithm.name.toLowerCase()}</span>
              </div>
              <Dropdown
                wrapClassName="compare-wrap"
                buttonClassName="btn btn-secondary"
                menuClassName="compare-menu"
                label={
                  <>
                    Porovnat <ChevronDown size={14} />
                  </>
                }
              >
                <div className="head">Porovnat s…</div>
                {algorithm.compareWith.map((item) => (
                  <Link key={item.name} href={item.href}>
                    {item.name} <span className="c">{item.complexity}</span>
                  </Link>
                ))}
              </Dropdown>
            </div>

            <h1>{algorithm.name}</h1>
            <p className="lede">{algorithm.lede}</p>
            <div className="meta-row">
              <Badge variant={algorithm.badge.variant} icon={algorithm.badge.icon}>
                {algorithm.badge.label}
              </Badge>
              <span className="sep" />
              <span className="item">
                <Activity /> složitost <span className="val">{algorithm.complexity}</span>
              </span>
              <span className="sep" />
              <span className="item">
                <BarChart2 /> úroveň <span className="val">{algorithm.level}</span>
              </span>
              <span className="sep" />
              <span className="item">
                <Clock /> <span className="val">{algorithm.readMinutes} min</span> čtení
              </span>
            </div>
          </section>

          {/* ───────── WORKSPACE ───────── */}
          <section className="workspace">
            <Player name={algorithm.name} datasetHints={algorithm.datasetHints} />

            <aside className="side-panel">
              <InputPanel />
              <div className="panel-card">
                <div className="panel-label">Color legend</div>
                <div className="legend">
                  {algorithm.legend.map((state) => (
                    <div className="item" key={state}>
                      <span
                        className="sw"
                        style={{ background: LEGEND[state].color, opacity: LEGEND[state].dim ? 0.35 : undefined }}
                      />{" "}
                      {state} <span className="desc">{LEGEND[state].desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          {/* ───────── TABS + CONTENT ───────── */}
          <section className="content-section">
            <ContentTabs tabs={CONTENT_TABS} />

            <article className="article" id="popis">
              <div className="prose">{algorithm.description}</div>
            </article>

            <div id="pseudokod">
              <div className="block-title">02 / Pseudokód</div>
              <Pseudocode lines={algorithm.pseudocode} />
              <div className="pseudo-hint">
                <MousePointerClick /> Klikni na&nbsp;řádek a&nbsp;přehrávač skočí na&nbsp;odpovídající krok.
              </div>
            </div>

            <div id="implementace">
              <div className="block-title">03 / Implementace</div>
              <CodeTabs implementations={algorithm.implementations} />
            </div>

            <div id="slozitost">
              <div className="block-title">04 / Složitost</div>
              <div className="cx-table">
                {algorithm.complexityCases.map((row) => (
                  <div key={row.label} className={row.tone ? `cx-row ${row.tone}` : "cx-row"}>
                    <div className="case">
                      {row.label}
                      <span className="sub">{row.sub}</span>
                    </div>
                    <div className="big-o">{row.bigO}</div>
                    <div className="note">{row.note}</div>
                  </div>
                ))}
              </div>
              <div className="chart-wrap">{algorithm.complexityChart}</div>
            </div>
          </section>

          {/* ───────── RELATED ───────── */}
          <section className="related">
            <div className="related-head">
              <div>
                <div className="section-marker">související</div>
                <h2>
                  Chcete <em>hlouběji?</em>
                </h2>
              </div>
            </div>
            <div className="related-grid">
              {algorithm.related.map((card) => (
                <AlgorithmCard key={card.title} {...card} />
              ))}
              <Link className="card arrow-card" href={algorithm.next.href}>
                <div className="card-top">
                  <span className="card-num">/ {algorithm.next.group}</span>
                  <Badge variant={algorithm.next.badge.variant} icon={algorithm.next.badge.icon}>
                    {algorithm.next.badge.label}
                  </Badge>
                </div>
                <div className="big-arrow">
                  {algorithm.next.name} <ArrowRight size={22} />
                </div>
                <div className="card-foot">
                  <span>{algorithm.next.complexity}</span>
                  <span>{algorithm.next.level}</span>
                </div>
              </Link>
            </div>
          </section>
        </main>

        <AiFab label="Zeptej se na&nbsp;tento algoritmus" ariaLabel="Zeptej se na tento algoritmus" collapsible />
      </div>
    </PlayerProvider>
  );
}
