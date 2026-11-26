"use client";

import { ArrowDown, ArrowRight, ChevronDown, Pause, Play, RotateCcw, Settings2, Shuffle, SkipBack, SkipForward, Zap } from "lucide-react";
import { useReducer, useState, type PointerEvent, type ReactNode } from "react";
import { Dropdown } from "@/components/Dropdown";
import { createPlayerState, playerReducer, SPEEDS } from "@/core/player/playerState";
import { useKeyboardControls, usePlaybackTimer } from "@/core/player/usePlayerControls";
import { useT } from "@/i18n/client";
import { Link } from "@/i18n/Link";
import type { MessageKey } from "@/i18n/translate";
import { buildTimeline, COMPARABLE, compareHref, operations, type Comparable, type CompareFrame } from "@/lib/compare";
import { mulberry32, seedFrom, seededShuffle } from "@/lib/random";
import { makeArray, type DatasetKind } from "@/models/array/datasets";
import { CompareColumn } from "./CompareColumn";
import { DatasetChoices, DataSettings } from "./DataControls";

/** One operation at speed 1×, in milliseconds. */
const OP_MS = 100;
const INITIAL_SIZE = 20;

/** The second counter of the sorting algorithms: what it counts besides comparisons (the word in the language is a message). */
const UNITS: Record<string, { name: string; word: MessageKey }> = {
  swp: { name: "Swaps", word: "compare.unit.swp" },
  wrt: { name: "Writes", word: "compare.unit.wrt" },
  shf: { name: "Shifts", word: "compare.unit.shf" },
};

/** The starting array is always the same, so the server and the browser render the same page. */
const INITIAL_INPUT = seededShuffle(
  Array.from({ length: INITIAL_SIZE }, (_, i) => i + 1),
  mulberry32(seedFrom("compare")),
);

const seconds = (ops: number) => ((ops * OP_MS) / 1000).toFixed(2);

/** Row of the metrics table: the numbers of both sides and how they differ. */
function MetricRow({ name, sub, a, b, diff }: { name: string; sub: string; a: ReactNode; b: ReactNode; diff: ReactNode }) {
  return (
    <div className="row">
      <span className="metric-name">
        {name}
        <span className="sub">{sub}</span>
      </span>
      <span className="num">{a}</span>
      <span className="num">{b}</span>
      <span className="diff">{diff}</span>
    </div>
  );
}

/** "−87 % Quick Sort": who needed less, and by how much; `same` is the word for a tie. */
function lessDiff(a: number, b: number, nameA: string, nameB: string, same: string): ReactNode {
  if (a === b) return <span className="tag">{same}</span>;
  const [less, more, name] = a < b ? [a, b, nameA] : [b, a, nameB];
  return (
    <>
      <ArrowDown /> −{Math.round((1 - less / more) * 100)}% <span className="tag">{name}</span>
    </>
  );
}

/** "5.5× Quick Sort": who is faster, and how many times; `same` is the word for a tie. */
function timesDiff(a: number, b: number, nameA: string, nameB: string, same: string): ReactNode {
  if (a === b) return <span className="tag">{same}</span>;
  const [less, more, name] = a < b ? [a, b, nameA] : [b, a, nameB];
  if (less === 0) return <span className="tag">{name}</span>;
  return (
    <>
      <Zap /> {(more / less).toFixed(1)}× <span className="tag">{name}</span>
    </>
  );
}

function timeline(a: Comparable, b: Comparable, input: number[]) {
  return buildTimeline(a.trace(input), b.trace(input));
}

/** The compare mode: two sorting algorithms on the same array, driven by one player. */
export function CompareWorkspace({ slugA, slugB }: { slugA: string; slugB: string }) {
  const { t, tn } = useT();
  const a = COMPARABLE.find((definition) => definition.slug === slugA)!;
  const b = COMPARABLE.find((definition) => definition.slug === slugB)!;
  const [state, dispatch] = useReducer(playerReducer, null, () =>
    createPlayerState(INITIAL_INPUT, "random", timeline(a, b, INITIAL_INPUT)),
  );
  usePlaybackTimer(state.playing, OP_MS / state.speed, dispatch);
  useKeyboardControls(dispatch);

  const input = state.input as number[];

  // The address chooses the algorithms. When it changes, both run again on the same array.
  const slots = `${slugA} ${slugB}`;
  const [loadedSlots, setLoadedSlots] = useState(slots);
  if (slots !== loadedSlots) {
    setLoadedSlots(slots);
    dispatch({ type: "load", input, inputKind: state.inputKind, steps: timeline(a, b, input) });
  }

  const frames = state.steps as ReturnType<typeof timeline>;
  const frame: CompareFrame = frames[state.index].state;
  const end = frames[frames.length - 1].state;
  const totalA = operations(end.a);
  const totalB = operations(end.b);
  const lastFrame = frames.length - 1;
  const progress = lastFrame > 0 ? (state.index / lastFrame) * 100 : 0;
  const firstOps = Math.min(totalA, totalB);

  // The second counter is called differently when, say, one algorithm swaps and the other writes.
  const secondA = a.counters[1];
  const secondB = b.counters[1];
  const sameUnit = secondA.key === secondB.key;
  const unitA = UNITS[secondA.key];
  const unitB = UNITS[secondB.key];

  const loadInput = (values: number[], kind: string) => {
    dispatch({ type: "load", input: values, inputKind: kind, steps: timeline(a, b, values) });
  };
  const newArray = (kind: DatasetKind, size = input.length) => loadInput(makeArray(kind, size), kind);
  const currentKind: DatasetKind = state.inputKind === "custom" ? "random" : (state.inputKind as DatasetKind);

  const seekTo = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    dispatch({ type: "seek", index: Math.round(ratio * lastFrame) });
  };

  // Choosing the algorithm of the other slot swaps the two.
  const hrefA = (next: Comparable) => compareHref(next.slug, next === b ? a.slug : b.slug);
  const hrefB = (next: Comparable) => compareHref(next === a ? b.slug : a.slug, next.slug);

  const slotMenu = (current: Comparable, hrefOf: (next: Comparable) => string) =>
    COMPARABLE.map((definition) => (
      <Link
        key={definition.slug}
        href={hrefOf(definition)}
        replace
        scroll={false}
        className={definition === current ? "cur" : undefined}
      >
        {definition.name} <span className="c">{definition.complexity}</span>
      </Link>
    ));

  // The result of the whole run, known in advance because both runs are recorded.
  const faster = totalA === totalB ? null : totalA < totalB ? a : b;
  const slower = faster === a ? b : a;
  const [fewer, more] = totalA <= totalB ? [totalA, totalB] : [totalB, totalA];
  const third = COMPARABLE.find((definition) => definition !== a && definition !== b);

  return (
    <>
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
              {a.name} <span className="x">✕</span> {b.name}
            </h1>
            <p className="sub">
              {t("compare.subtitle")} <em>{t("compare.subtitleEm")}</em>
            </p>
          </div>
          <div className="head-actions">
            <Dropdown
              stayOpen
              wrapClassName="swap-wrap"
              buttonClassName="btn btn-secondary"
              menuClassName="swap-menu"
              label={
                <>
                  <Settings2 size={15} /> {t("compare.dataSettings")}
                </>
              }
            >
              <DataSettings
                input={input}
                kind={state.inputKind}
                onKind={(kind) => newArray(kind)}
                onSize={(size) => newArray(currentKind, size)}
                onOwn={(values) => loadInput(values, "custom")}
              />
            </Dropdown>
            <Dropdown
              wrapClassName="swap-wrap"
              buttonClassName="btn btn-secondary"
              menuClassName="swap-menu"
              label={
                <>
                  {t("compare.changeAlgorithms")} <ChevronDown size={14} />
                </>
              }
            >
              <div className="grp">slot A — sorting</div>
              {slotMenu(a, hrefA)}
              <div className="divline" />
              <div className="grp">slot B — sorting</div>
              {slotMenu(b, hrefB)}
            </Dropdown>
          </div>
        </div>
      </section>

      {/* DUO VISUALIZATION */}
      <section className="compare-stage">
        <div className="duo">
          <div className="duo-grid">
            <CompareColumn
              side="left"
              definition={a}
              step={frame.a}
              ops={frame.opsA}
              total={totalA}
              seconds={seconds(frame.opsA)}
              started={state.index > 0}
              waiting={state.index < lastFrame}
            />
            <div className="divider" />
            <CompareColumn
              side="right"
              definition={b}
              step={frame.b}
              ops={frame.opsB}
              total={totalB}
              seconds={seconds(frame.opsB)}
              started={state.index > 0}
              waiting={state.index < lastFrame}
            />
          </div>
        </div>

        {/* UNIFIED PLAYER */}
        <div className="unified-player">
          <div className="up-controls">
            <div className="up-left">
              <button
                className="btn btn-secondary btn-icon btn-sm"
                aria-label={t("player.reset")}
                title={t("player.resetTitle")}
                disabled={state.index === 0}
                onClick={() => dispatch({ type: "reset" })}
              >
                <RotateCcw size={14} />
              </button>
              <button
                className="btn btn-secondary btn-icon btn-sm"
                aria-label={t("player.back")}
                title={t("player.backTitle")}
                disabled={state.index === 0}
                onClick={() => dispatch({ type: "step", delta: -1 })}
              >
                <SkipBack size={14} />
              </button>
              <button
                className="btn btn-primary btn-icon"
                aria-label={state.playing ? t("player.pause") : t("player.play")}
                title={state.playing ? t("player.pauseTitle") : t("player.playTitle")}
                onClick={() => dispatch({ type: "toggle" })}
              >
                {state.playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                className="btn btn-secondary btn-icon btn-sm"
                aria-label={t("player.forward")}
                title={t("player.forwardTitle")}
                disabled={state.index === lastFrame}
                onClick={() => dispatch({ type: "step", delta: 1 })}
              >
                <SkipForward size={14} />
              </button>
            </div>
            <div className="up-center">
              {/* The shared bar follows the slower algorithm; the marker shows where the faster one ended. */}
              <div
                className="up-progress"
                title={t("compare.shared")}
                role="slider"
                tabIndex={0}
                aria-label={t("compare.sharedAria")}
                aria-valuemin={0}
                aria-valuemax={lastFrame}
                aria-valuenow={state.index}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  seekTo(event);
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) seekTo(event);
                }}
              >
                <div className="fill" style={{ width: `${progress}%` }} />
                <div
                  className="marker"
                  style={{ left: `${lastFrame > 0 ? (firstOps / lastFrame) * 100 : 100}%` }}
                  title={t("compare.finished", { name: totalA <= totalB ? a.name : b.name })}
                />
                <div className="handle" style={{ left: `${progress}%` }} />
              </div>
            </div>
            <div className="up-right">
              <Dropdown
                wrapClassName="chip-wrap"
                buttonClassName="chip-control"
                menuClassName="chip-menu"
                label={
                  <>
                    <span className="lbl">speed</span> {state.speed.toFixed(1)}×{" "}
                    <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
                  </>
                }
              >
                <div className="head">{t("player.speed")}</div>
                {SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    className={speed === state.speed ? "on" : undefined}
                    onClick={() => dispatch({ type: "speed", speed })}
                  >
                    {speed.toFixed(1)}×
                  </button>
                ))}
              </Dropdown>
              <Dropdown
                wrapClassName="chip-wrap"
                buttonClassName="chip-control"
                menuClassName="chip-menu"
                label={
                  <>
                    <span className="lbl">array</span> {state.inputKind} · n={input.length}{" "}
                    <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
                  </>
                }
              >
                <div className="head">{t("data.head")}</div>
                <DatasetChoices kind={state.inputKind} onChoose={(kind) => newArray(kind)} />
              </Dropdown>
            </div>
          </div>
          <div className="up-hint">
            <span className="c">{"//"}</span> {t("compare.hintData")} <span className="c">·</span>{" "}
            <span className="accent">plays at fixed ops/sec</span> <span className="c">·</span> {t("compare.hintOperation")}
          </div>
        </div>
      </section>

      {/* LIVE METRICS */}
      <section className="metrics-section">
        <div className="ms-head">
          <div className="section-marker">live metrics</div>
          <h2>
            {t("compare.metrics")} <em>{t("compare.metricsEm")}</em>
          </h2>
        </div>

        <div className="mtable">
          <div className="row header">
            <span className="h">{t("compare.metric")}</span>
            <span className="h algo">{a.name}</span>
            <span className="h algo">{b.name}</span>
            <span className="h">difference</span>
          </div>
          <MetricRow
            name="Comparisons"
            sub={t("compare.subComparisons")}
            a={frame.a.counters.cmp}
            b={frame.b.counters.cmp}
            diff={lessDiff(frame.a.counters.cmp, frame.b.counters.cmp, a.name, b.name, t("compare.same"))}
          />
          <MetricRow
            name={sameUnit ? unitA.name : `${unitA.name} / ${unitB.name.toLowerCase()}`}
            sub={sameUnit ? t(unitA.word) : `${t(unitA.word)} / ${t(unitB.word)}`}
            a={`${frame.a.counters[secondA.key]}${sameUnit ? "" : ` ${secondA.label}`}`}
            b={`${frame.b.counters[secondB.key]}${sameUnit ? "" : ` ${secondB.label}`}`}
            // A swap, a write and a shift are different work: no percentage between them.
            diff={
              sameUnit ? (
                lessDiff(frame.a.counters[secondA.key], frame.b.counters[secondB.key], a.name, b.name, t("compare.same"))
              ) : (
                <span className="tag">{t("compare.otherUnits")}</span>
              )
            }
          />
          <MetricRow
            name="Operations"
            sub={t("compare.subOperations")}
            a={frame.opsA}
            b={frame.opsB}
            diff={timesDiff(frame.opsA, frame.opsB, a.name, b.name, t("compare.same"))}
          />
          <MetricRow
            name="Time at 1×"
            sub={t("compare.subTime")}
            a={`${seconds(frame.opsA)}s`}
            b={`${seconds(frame.opsB)}s`}
            diff={timesDiff(frame.opsA, frame.opsB, a.name, b.name, t("compare.same"))}
          />
        </div>
      </section>

      {/* INSIGHT */}
      <section style={{ paddingBottom: "8px" }}>
        <div className="insight">
          <div className="label">— result</div>
          {faster ? (
            <p>
              {t("compare.fasterDone", { name: faster.name })}
              <span className="mono-n">{tn("compare.ops", fewer)}</span>. {t("compare.slowerNeeded", { name: slower.name })}{" "}
              <span className="mono-n">{more}</span> — <em>{t("compare.times", { k: (more / fewer).toFixed(1) })}</em>.
            </p>
          ) : (
            <p>
              {t("compare.tie")} <span className="mono-n">{tn("compare.ops", fewer)}</span>.
            </p>
          )}
          <p className="dim">
            {a.complexity === b.complexity
              ? t("compare.sameComplexity", { c: a.complexity })
              : t("compare.diffComplexity", { a: a.complexity, b: b.complexity })}{" "}
            {faster && faster.complexity === "O(n²)" && slower.complexity !== "O(n²)" ? t("compare.worseWon") : ""}
            {sameUnit ? "" : ` ${t("compare.unitsWarning", { a: t(unitA.word), b: t(unitB.word) })}`}
            {a.slug === "merge-sort" || b.slug === "merge-sort" ? ` ${t("compare.mergeMemory")}` : ""}
          </p>
          <div className="actions">
            {third && (
              // The new algorithm takes the place of the slower one.
              <Link className="btn btn-primary" href={faster === b ? hrefA(third) : hrefB(third)} replace scroll={false}>
                {t("compare.compareWith", { name: third.name })} <ArrowRight size={14} />
              </Link>
            )}
            <button className="btn btn-secondary" onClick={() => newArray(currentKind)}>
              <Shuffle size={14} /> {t("compare.otherData")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
