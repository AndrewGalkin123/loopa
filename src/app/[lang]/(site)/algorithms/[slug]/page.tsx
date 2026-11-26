import type { Metadata } from "next";
import { Activity, ArrowRight, BarChart2, ChevronDown, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { CONTENT } from "@/algorithms/content";
import { ALGORITHMS, findAlgorithm } from "@/algorithms/registry";
import { AiFab } from "@/components/AiFab";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { AlgorithmSections } from "@/components/algorithm/AlgorithmSections";
import { PlayerLegend } from "@/components/algorithm/Legend";
import { TaskList } from "@/components/algorithm/TaskList";
import { Badge } from "@/components/Badge";
import { Dropdown } from "@/components/Dropdown";
import { Player } from "@/core/player/Player";
import { StepStatus } from "@/core/player/StepStatus";
import { catalogCard } from "@/lib/catalog";
import { hasTranslation, pick } from "@/i18n/config";
import { Link } from "@/i18n/Link";
import { getTranslator } from "@/i18n/server";
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

export default async function AlgorithmPage({ params }: Props) {
  const definition = findAlgorithm((await params).slug);
  if (!definition) notFound();
  const { t, tx, locale } = await getTranslator();
  // The texts in the language of the page, or in Czech until they are translated.
  const texts = CONTENT[definition.slug];
  const content = pick(texts, locale);
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
              {/* For now only sorting algorithms can be compared. */}
              {definition.group === "sorting" ? (
                <Link className="btn btn-secondary btn-sm" href={`/compare?a=${definition.slug}`}>
                  {t("algo.compare")} <ArrowRight size={13} />
                </Link>
              ) : (
                <button className="btn btn-secondary btn-sm">
                  {t("algo.compare")} <ChevronDown size={13} />
                </button>
              )}
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
                    {t("algo.compare")} <ChevronDown size={14} />
                  </>
                }
              >
                <div className="head">{t("algo.compareWith")}</div>
                {content.compareWith.map((item) => (
                  <Link key={item.name} href={item.href}>
                    {item.name} <span className="c">{item.complexity}</span>
                  </Link>
                ))}
              </Dropdown>
            </div>

            {!hasTranslation(texts, locale) && <p className="untranslated">{t("untranslated")}</p>}
            <h1>{definition.name}</h1>
            <p className="lede">{content.lede}</p>
            <div className="meta-row">
              <Badge variant={definition.card.badge.variant} icon={definition.card.badge.icon}>
                {definition.card.badge.label}
              </Badge>
              <span className="sep" />
              <span className="item">
                <Activity /> {t("algo.complexity")} <span className="val">{definition.complexity}</span>
              </span>
              <span className="sep" />
              <span className="item">
                <BarChart2 /> {t("algo.level")} <span className="val">{definition.level}</span>
              </span>
              <span className="sep" />
              <span className="item">
                <Clock /> <span className="val">{content.readMinutes} min</span> {t("algo.read")}
              </span>
            </div>
          </section>

          {/* ───────── WORKSPACE ───────── */}
          <section className="workspace">
            <Player />

            <aside className="side-panel">
              <model.InputPanel />
              <PlayerLegend />
            </aside>
          </section>

          {/* ───────── TASKS "find an input such that …" ───────── */}
          <TaskList />

          {/* ───────── TABS + CONTENT ───────── */}
          <AlgorithmSections content={content} locale={locale} linkedToPlayer />

          {/* ───────── RELATED ───────── */}
          <section className="related">
            <div className="related-head">
              <div>
                <div className="section-marker">{t("algo.related")}</div>
                <h2>
                  {t("algo.deeper")} <em>{t("algo.deeperEm")}</em>
                </h2>
              </div>
            </div>
            <div className="related-grid">
              {content.related.map((slug) => (
                <AlgorithmCard key={slug} {...catalogCard(slug)} description={tx(catalogCard(slug).description)} />
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

        <AiFab label={t("algo.ask")} ariaLabel={t("algo.askAria")} collapsible />
      </div>
    </AlgorithmProvider>
  );
}
