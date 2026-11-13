"use client";

import { ChevronDown, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { Dropdown } from "@/components/Dropdown";
import type { PredictionView, Reply } from "@/core/types";
import { pad } from "@/lib/demoSteps";
import { Note } from "./Note";
import { usePlayer } from "./PlayerProvider";
import { SPEEDS, STEP_MS } from "./playerState";
import { QuestionBar } from "./QuestionBar";
import { useKeyboardControls } from "./usePlayerControls";

const PROGRESS_TICKS = 24;

/**
 * The player: head with the status and counters, the stage drawn by the data model,
 * the progress bar and the controls. It works the same for every algorithm and model.
 * In the mode Předpověz a question bar appears under the head and the picture can be clicked.
 */
export function Player() {
  const { state, step, dispatch, definition, model } = usePlayer();
  const last = state.steps.length - 1;
  const progress = last > 0 ? (state.index / last) * 100 : 0;

  useKeyboardControls(dispatch);

  // The mode Předpověz: the question on screen, its result and the vertices clicked so far (for a sequence).
  const asking = state.asking;
  const question = asking ? state.questions[asking.question] : null;
  const result = asking ? state.results[asking.question] : undefined;
  const [draft, setDraft] = useState<{ question: number; ids: string[] }>({ question: -1, ids: [] });
  const chosen = asking && draft.question === asking.question ? draft.ids : [];
  const answered = Object.values(state.results).filter((r) => r.reply !== null);

  const reply = (value: Reply) => dispatch({ type: "answer", reply: value });
  const onPick = (id: string) => {
    if (!asking || !question) return;
    if (question.answer.kind === "pick") return reply([id]);
    // A sequence: a click adds the vertex, a second click takes it back.
    setDraft({ question: asking.question, ids: chosen.includes(id) ? chosen.filter((c) => c !== id) : [...chosen, id] });
  };

  const clickable = question !== null && question.answer.kind !== "yes-no";
  const prediction: PredictionView | undefined = question
    ? {
        onPick: clickable && !result ? onPick : undefined,
        chosen: result ? (Array.isArray(result.reply) ? result.reply : []) : chosen,
        correct: result && question.answer.kind !== "yes-no" ? question.answer.correct : undefined,
        hide: result ? undefined : question.hide,
      }
    : undefined;

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
          <div className="title">
            {definition.name}
            {definition.questions && (
              <div className="mode-switch" role="group" aria-label="Režim přehrávače">
                <button
                  className={state.mode === "watch" ? "on" : undefined}
                  aria-pressed={state.mode === "watch"}
                  onClick={() => dispatch({ type: "mode", mode: "watch" })}
                >
                  Sleduj
                </button>
                <button
                  className={state.mode === "predict" ? "on" : undefined}
                  aria-pressed={state.mode === "predict"}
                  onClick={() => dispatch({ type: "mode", mode: "predict" })}
                >
                  Předpověz
                </button>
              </div>
            )}
          </div>
          <div className="status">
            step <span className="accent">{pad(state.index + 1)}</span> / {state.steps.length} &nbsp;·&nbsp;{" "}
            {/* The status line could give the answer away. */}
            {question && !result ? "čeká na tvou předpověď" : <Note parts={step.note} />}
          </div>
        </div>
        <div className="head-metrics">
          {definition.counters.map((counter) => (
            <div className="metric" key={counter.key}>
              <span className="k">{counter.label}</span>
              <span className="v">{pad(step.counters[counter.key] ?? 0)}</span>
            </div>
          ))}
          {state.mode === "predict" && (
            <div className="metric" title="správné předpovědi / zodpovězené otázky">
              <span className="k">předpovědi</span>
              <span className="v">
                {answered.filter((r) => r.correct).length}/{answered.length}
              </span>
            </div>
          )}
          {/* Time the run takes up to this step at speed 1× (independent of the chosen speed). */}
          <div className="metric accent">
            <span className="k">elapsed</span>
            <span className="v">{((state.index * STEP_MS) / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {question && (
        <QuestionBar
          question={question}
          result={result}
          chosen={chosen}
          onReply={reply}
          onNext={() => dispatch({ type: "step", delta: 1 })}
        />
      )}

      <div className="player-stage">
        <model.View state={step.state} prediction={prediction} />
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
