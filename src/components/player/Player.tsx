"use client";

import { ChevronDown, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, type PointerEvent, type ReactNode } from "react";
import type { ArrayStep, DatasetKind } from "@/algorithms/types";
import { Dropdown } from "@/components/Dropdown";
import { VizBars, type BarClass } from "@/components/VizBars";
import { pad } from "@/lib/demoSteps";
import { DATASETS, makeArray } from "./datasets";
import { usePlayer } from "./PlayerProvider";
import { SPEEDS, STEP_MS } from "./playerState";

/** Up to this size the values are written under the bars; bigger arrays would overlap. */
const MAX_LABELED = 24;
const PROGRESS_TICKS = 24;

/**
 * Colour of a bar: settled values are cyan, compared amber, swapped lime, the pivot pink;
 * bars outside the part being worked on are dimmed.
 */
function barClass(step: ArrayStep, i: number): BarClass {
  if (step.sorted.includes(i)) return "sorted";
  if (step.indices.includes(i)) {
    if (step.kind === "compare") return "compared";
    if (step.kind === "swap" || step.kind === "write") return "active";
  }
  if (i === step.pivot) return "pivot";
  if (step.range && (i < step.range[0] || i > step.range[1])) return "dimmed";
  return "";
}

/** Text after "step N / M" in the player head. */
function describe(step: ArrayStep): ReactNode {
  // " [3] [4]" in the given colour.
  const indices = (list: number[], color: string) =>
    list.map((i) => (
      <span key={i} style={{ color }}>
        {" "}[{i}]
      </span>
    ));
  const pivot = step.pivot !== undefined && <> with pivot{indices([step.pivot], "var(--viz-pivot)")}</>;
  // "[0..7] + [8..14]": the two halves of the current part.
  const halves = step.range && step.mid !== undefined && (
    <>
      [{step.range[0]}..{step.mid}] + [{step.mid + 1}..{step.range[1]}]
    </>
  );

  switch (step.kind) {
    case "start":
      return "ready";
    case "pass":
      return `pass ${step.pass}`;
    case "partition":
      return (
        <>
          partition [{step.range?.join("..")}], pivot{indices([step.pivot ?? 0], "var(--viz-pivot)")}
        </>
      );
    case "split":
      return (
        <>
          split [{step.range?.join("..")}] → {halves}
        </>
      );
    case "merge":
      return <>merge {halves}</>;
    case "compare":
      return (
        <>
          comparing{indices(step.indices, "var(--viz-compared)")}
          {pivot}
        </>
      );
    case "swap":
      return <>swapped{indices(step.indices, "var(--viz-active)")}</>;
    case "write": {
      const [first] = step.indices;
      const last = step.indices[step.indices.length - 1];
      return (
        <>
          written to{" "}
          <span style={{ color: "var(--viz-active)" }}>{first === last ? `[${first}]` : `[${first}..${last}]`}</span>
        </>
      );
    }
    case "settle":
      return <>{indices(step.indices, "var(--viz-sorted)")} in place</>;
    case "done":
      return "sorted";
  }
}

export function Player({ name, datasetHints = {} }: {
  name: string;
  /** Hints in the "array" menu that replace the neutral ones, e.g. sorted → "nejhorší případ". */
  datasetHints?: Partial<Record<DatasetKind, string>>;
}) {
  const { state, step, dispatch, load, swapLabel } = usePlayer();
  const last = state.steps.length - 1;
  const progress = last > 0 ? (state.index / last) * 100 : 0;
  const n = state.input.length;
  const datasetLabel = DATASETS.find((d) => d.id === state.dataset)?.label ?? "custom";

  // Keyboard: space = play/pause, ← / → = step, R = back to the start.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      // Typing into a field must not control the player.
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      if (event.key === " ") {
        // A focused button already reacts to space by itself.
        if (target?.closest("button, a")) return;
        event.preventDefault();
        dispatch({ type: "toggle" });
      } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        dispatch({ type: "step", delta: event.key === "ArrowRight" ? 1 : -1 });
      } else if (event.key === "r" || event.key === "R") {
        dispatch({ type: "reset" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);

  // Clicking or dragging on the progress bar jumps to that point of the run.
  const seekTo = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    dispatch({ type: "seek", index: Math.round(ratio * last) });
  };

  return (
    <div className="player">
      <div className="player-head">
        <div>
          <div className="title">{name}</div>
          <div className="status">
            step <span className="accent">{pad(state.index + 1)}</span> / {state.steps.length} &nbsp;·&nbsp;{" "}
            {describe(step)}
          </div>
        </div>
        <div className="head-metrics">
          <div className="metric">
            <span className="k">cmp</span>
            <span className="v">{pad(step.cmp)}</span>
          </div>
          <div className="metric">
            <span className="k">{swapLabel}</span>
            <span className="v">{pad(step.swp)}</span>
          </div>
          {/* Time the run takes up to this step at speed 1× (independent of the chosen speed). */}
          <div className="metric accent">
            <span className="k">elapsed</span>
            <span className="v">{((state.index * STEP_MS) / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>

      <div className="player-stage">
        <VizBars values={step.array} classOf={(i) => barClass(step, i)} labels={n <= MAX_LABELED} minHeight={8} />
      </div>

      <div
        className="player-progress"
        role="slider"
        tabIndex={0}
        aria-label="Průběh algoritmu"
        aria-valuemin={1}
        aria-valuemax={state.steps.length}
        aria-valuenow={state.index + 1}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          seekTo(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) seekTo(event);
        }}
      >
        <div className="fill" style={{ width: `${progress}%` }} />
        <div className="ticks">
          {Array.from({ length: PROGRESS_TICKS }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="handle" style={{ left: `${progress}%` }} />
      </div>

      <div className="player-controls">
        <div className="controls-left">
          <button
            className="btn btn-secondary btn-icon btn-sm"
            aria-label="Reset"
            title="Na začátek (R)"
            disabled={state.index === 0}
            onClick={() => dispatch({ type: "reset" })}
          >
            <RotateCcw size={14} />
          </button>
          <button
            className="btn btn-secondary btn-icon btn-sm"
            aria-label="Krok zpět"
            title="Krok zpět (←)"
            disabled={state.index === 0}
            onClick={() => dispatch({ type: "step", delta: -1 })}
          >
            <SkipBack size={14} />
          </button>
          <button
            className="btn btn-primary btn-icon"
            aria-label={state.playing ? "Pozastavit" : "Přehrát"}
            title={state.playing ? "Pozastavit (mezerník)" : "Přehrát (mezerník)"}
            onClick={() => dispatch({ type: "toggle" })}
          >
            {state.playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            className="btn btn-secondary btn-icon btn-sm"
            aria-label="Krok vpřed"
            title="Krok vpřed (→)"
            disabled={state.index === last}
            onClick={() => dispatch({ type: "step", delta: 1 })}
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div className="controls-right">
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
            <div className="head">rychlost</div>
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
                <span className="lbl">array</span> {datasetLabel} · n={n}{" "}
                <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
              </>
            }
          >
            <div className="head">vstupní data</div>
            {DATASETS.map((dataset) => (
              <button
                key={dataset.id}
                className={dataset.id === state.dataset ? "on" : undefined}
                onClick={() => load(makeArray(dataset.id, n), dataset.id)}
              >
                {dataset.label} <span className="c">{datasetHints[dataset.id] ?? dataset.hint}</span>
              </button>
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
