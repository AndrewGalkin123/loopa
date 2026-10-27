import type { Metadata } from "next";
import { Activity, ArrowRight, BarChart2, ChevronDown, Clock, MousePointerClick } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT } from "@/algorithms/content";
import { ALGORITHMS, findAlgorithm } from "@/algorithms/registry";
import { AiFab } from "@/components/AiFab";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { CodeTabs } from "@/components/algorithm/CodeTabs";
import { ContentTabs } from "@/components/algorithm/ContentTabs";
import { Pseudocode } from "@/components/algorithm/Pseudocode";
import { Badge } from "@/components/Badge";
import { Dropdown } from "@/components/Dropdown";
import { Player } from "@/core/player/Player";
import { StepStatus } from "@/core/player/StepStatus";
import { catalogCard } from "@/lib/catalog";
import { MODELS } from "@/models";
import { AlgorithmProvider } from "./AlgorithmProvider";
import "./algorithm.css";

/*
 * One template for every algorithm page (/algorithms/bubble-sort, /algorithms/quick-sort …).
 * What it shows comes from three places:
 *   definition — name, complexity, the player (src/algorithms/<category>/<slug>/definition.ts)
 *   content    — the long texts (…/content.tsx, via src/algorithms/content.ts)
 *   model      — how the player draws the data and changes the input (src/models)
 */

type Props = { params: Promise<{ slug: string }> };

// Pages are generated at build time for every known algorithm; other slugs give 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return ALGORITHMS.map((definition) => ({ slug: definition.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const definition = findAlgorithm((await params).slug);
  return { title: definition ? `${definition.name} — Loopa` : "Loopa" };
}

const CONTENT_TABS = [
  { id: "popis", label: "Popis" },
  { id: "pseudokod", label: "Pseudokód" },
  { id: "implementace", label: "Implementace" },
  { id: "slozitost", label: "Složitost" },
];

export default async function AlgorithmPage({ params }: Props) {
  const definition = findAlgorithm((await params).slug);
  if (!definition) notFound();
  const content = CONTENT[definition.slug];
  const model = MODELS[definition.model];

  return (
    <AlgorithmProvider slug={definition.slug}>
      <div className="page-algorithm">
        {/* ───────── SECOND-LEVEL STICKY ───────── */}
        <div className="subnav">
          <div className="subnav-inner">
            <div className="crumbs">
              <Link href="/algorithms">algorithms</Link>
              <span className="sep">/</span>
              <a href="#">{definition.group}</a>
            </div>
            <div className="algo-name">
              <span>{definition.name}</span>
              <Badge variant={definition.card.badge.variant} icon={definition.card.badge.icon}>
                {definition.card.badge.label}
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
                <a href="#">{definition.group}</a>
                <span className="sep">/</span>
                <span className="here">{definition.name.toLowerCase()}</span>
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
                {content.compareWith.map((item) => (
                  <Link key={item.name} href={item.href}>
                    {item.name} <span className="c">{item.complexity}</span>
                  </Link>
                ))}
              </Dropdown>
            </div>

            <h1>{definition.name}</h1>
            <p className="lede">{content.lede}</p>
            <div className="meta-row">
              <Badge variant={definition.card.badge.variant} icon={definition.card.badge.icon}>
                {definition.card.badge.label}
              </Badge>
              <span className="sep" />
              <span className="item">
                <Activity /> složitost <span className="val">{definition.complexity}</span>
              </span>
              <span className="sep" />
              <span className="item">
                <BarChart2 /> úroveň <span className="val">{definition.level}</span>
              </span>
              <span className="sep" />
              <span className="item">
                <Clock /> <span className="val">{content.readMinutes} min</span> čtení
              </span>
            </div>
          </section>

          {/* ───────── WORKSPACE ───────── */}
          <section className="workspace">
            <Player />

            <aside className="side-panel">
              <model.InputPanel />
              <div className="panel-card">
                <div className="panel-label">Color legend</div>
                <div className="legend">
                  {definition.legend.map((mark) => (
                    <div className="item" key={mark}>
                      <span
                        className="sw"
                        style={{ background: model.legend[mark].color, opacity: model.legend[mark].dim ? 0.35 : undefined }}
                      />{" "}
                      {mark} <span className="desc">{model.legend[mark].desc}</span>
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
              <div className="prose">{content.description}</div>
            </article>

            <div id="pseudokod">
              <div className="block-title">02 / Pseudokód</div>
              <Pseudocode lines={content.pseudocode} />
              <div className="pseudo-hint">
                <MousePointerClick /> Klikni na&nbsp;řádek a&nbsp;přehrávač skočí na&nbsp;odpovídající krok.
              </div>
            </div>

            <div id="implementace">
              <div className="block-title">03 / Implementace</div>
              <CodeTabs implementations={content.implementations} />
            </div>

            <div id="slozitost">
              <div className="block-title">04 / Složitost</div>
              <div className="cx-table">
                {content.complexityCases.map((row) => (
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
              <div className="chart-wrap">{content.complexityChart}</div>
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
              {content.related.map((slug) => (
                <AlgorithmCard key={slug} {...catalogCard(slug)} />
              ))}
              <Link className="card arrow-card" href={content.next.href}>
                <div className="card-top">
                  <span className="card-num">/ {content.next.group}</span>
                  <Badge variant={content.next.badge.variant} icon={content.next.badge.icon}>
                    {content.next.badge.label}
                  </Badge>
                </div>
                <div className="big-arrow">
                  {content.next.name} <ArrowRight size={22} />
                </div>
                <div className="card-foot">
                  <span>{content.next.complexity}</span>
                  <span>{content.next.level}</span>
                </div>
              </Link>
            </div>
          </section>
        </main>

        <AiFab label="Zeptej se na&nbsp;tento algoritmus" ariaLabel="Zeptej se na tento algoritmus" collapsible />
      </div>
    </AlgorithmProvider>
  );
}
