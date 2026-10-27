"use client";

import { ChevronDown, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Fragment, useEffect, type PointerEvent } from "react";
import { Dropdown } from "@/components/Dropdown";
import type { NotePart } from "@/core/types";
import { pad } from "@/lib/demoSteps";
import { usePlayer } from "./PlayerProvider";
import { SPEEDS, STEP_MS } from "./playerState";

const PROGRESS_TICKS = 24;

/** Status line of a step: the parts joined by spaces, marked parts in the colour of their mark. */
function Note({ parts }: { parts: NotePart[] }) {
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      {typeof part === "string" ? part : <span style={{ color: `var(--viz-${part.mark})` }}>{part.text}</span>}
    </Fragment>
  ));
}

/**
 * The player: head with the status and counters, the stage drawn by the data model,
 * the progress bar and the controls. It works the same for every algorithm and model.
 */
export function Player() {
  const { state, step, dispatch, definition, model } = usePlayer();
  const last = state.steps.length - 1;
  const progress = last > 0 ? (state.index / last) * 100 : 0;

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
          <div className="title">{definition.name}</div>
          <div className="status">
            step <span className="accent">{pad(state.index + 1)}</span> / {state.steps.length} &nbsp;·&nbsp;{" "}
            <Note parts={step.note} />
          </div>
        </div>
        <div className="head-metrics">
          {definition.counters.map((counter) => (
            <div className="metric" key={counter.key}>
              <span className="k">{counter.label}</span>
              <span className="v">{pad(step.counters[counter.key] ?? 0)}</span>
            </div>
          ))}
          {/* Time the run takes up to this step at speed 1× (independent of the chosen speed). */}
          <div className="metric accent">
            <span className="k">elapsed</span>
            <span className="v">{((state.index * STEP_MS) / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>

      <div className="player-stage">
        <model.View state={step.state} />
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

          {/* Prepared inputs: what they are depends on the data model. */}
          <model.DataMenu />
        </div>
      </div>
    </div>
  );
}
