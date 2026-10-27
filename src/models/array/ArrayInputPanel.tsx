"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { usePlayer } from "@/core/player/PlayerProvider";
import { formatArray, makeArray, MAX_SIZE, parseArray, type DatasetKind } from "./datasets";

/** Smallest size on the slider (as in the design); the own input allows even 2 values. */
const SLIDER_MIN = 5;

/** Side panel "Input" of the array model: array size, own input array and a new random array. */
export function ArrayInputPanel() {
  const { state, load } = usePlayer();
  const input = state.input as number[];
  const n = input.length;
  const current = formatArray(input);
  // A new array keeps the current kind; an own (custom) input is replaced by a random one.
  const kind: DatasetKind = state.inputKind === "custom" ? "random" : (state.inputKind as DatasetKind);
  // The error belongs to the array it was typed over; once the array changes, it disappears.
  const [error, setError] = useState<{ over: string; message: string } | null>(null);
  const shownError = error?.over === current ? error.message : null;

  const applyText = (text: string) => {
    if (text.trim() === current) return;
    const result = parseArray(text);
    if ("error" in result) {
      setError({ over: current, message: result.error });
    } else if (formatArray(result.values) !== current) {
      setError(null);
      load(result.values, "custom");
    }
  };

  return (
    <div className="panel-card">
      <div className="panel-label">Input</div>
      <div className="field">
        <div className="flabel">
          <span className="name">Velikost pole</span>
          <span className="num">{n}</span>
        </div>
        <input
          type="range"
          min={SLIDER_MIN}
          max={MAX_SIZE}
          value={Math.max(SLIDER_MIN, n)}
          className="slider"
          aria-label="Velikost pole"
          onChange={(event) => load(makeArray(kind, Number(event.target.value)), kind)}
        />
      </div>
      <div className="field">
        <div className="flabel">
          <span className="name">Vlastní vstup</span>
        </div>
        {/* The field always shows the array in the player; key resets it when that array changes. */}
        <input
          key={current}
          type="text"
          className={shownError ? "input-mono invalid" : "input-mono"}
          defaultValue={current}
          aria-label="Vlastní vstup"
          aria-invalid={shownError !== null}
          aria-describedby={shownError ? "input-error" : undefined}
          spellCheck={false}
          onBlur={(event) => applyText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyText(event.currentTarget.value);
          }}
        />
        {shownError && (
          <div className="field-error" id="input-error">
            {shownError}
          </div>
        )}
      </div>
      <div className="field">
        <button className="btn btn-secondary btn-sm" onClick={() => load(makeArray("random", n), "random")}>
          <Shuffle size={13} /> Nové náhodné pole
        </button>
      </div>
    </div>
  );
}
