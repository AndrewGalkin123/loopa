"use client";

import { Shuffle, Target } from "lucide-react";
import { useState } from "react";
import { usePlayer } from "@/core/player/PlayerProvider";
import { useT } from "@/i18n/client";
import type { Text } from "@/i18n/config";
import { formatArray, MAX_SIZE, MAX_VALUE, parseArray } from "@/models/array/datasets";
import { makeValues, targetInside, targetOutside, type SearchDataset } from "./datasets";
import type { SearchAlgorithm, SearchInput } from "./types";

/** Smallest size on the slider; the own input allows even 2 values. */
const SLIDER_MIN = 5;

/** Side panel "Input": the wanted value, array size, own array and a new random array. */
export function SearchInputPanel() {
  const { state, load, definition } = usePlayer();
  const { t, tx } = useT();
  const { values, target } = state.input as SearchInput;
  const requiresSorted = (definition as SearchAlgorithm).requiresSorted;
  const current = formatArray(values);
  const fallback: SearchDataset = requiresSorted ? "random" : "shuffled";
  const kind = state.inputKind === "custom" ? fallback : (state.inputKind as SearchDataset);

  // The text being typed into the target field; null = show the current target.
  const [targetDraft, setTargetDraft] = useState<string | null>(null);
  // The error belongs to the array it was typed over; once the array changes, it disappears.
  const [error, setError] = useState<{ over: string; message: Text } | null>(null);
  const shownError = error?.over === current ? error.message : null;

  /** A new array; the target stays when it is still in the array. */
  const loadValues = (next: number[], nextKind: string) => {
    load({ values: next, target: next.includes(target) ? target : targetInside(next) }, nextKind);
  };

  const applyText = (text: string) => {
    if (text.trim() === current) return;
    const result = parseArray(text);
    if ("error" in result) {
      setError({ over: current, message: result.error });
      return;
    }
    const next = requiresSorted ? [...result.values].sort((a, b) => a - b) : result.values;
    if (formatArray(next) !== current) {
      setError(null);
      loadValues(next, "custom");
    }
  };

  return (
    <div className="panel-card">
      <div className="panel-label">Input</div>
      <div className="field">
        <div className="flabel">
          <span className="name">{t("input.target")}</span>
          <span className="num">{target}</span>
        </div>
        <input
          type="number"
          className="input-mono"
          min={0}
          max={MAX_VALUE}
          value={targetDraft ?? target}
          aria-label={t("input.target")}
          onChange={(event) => {
            setTargetDraft(event.target.value);
            const value = Number(event.target.value);
            if (event.target.value !== "" && Number.isInteger(value) && value >= 0 && value <= MAX_VALUE) {
              load({ values, target: value }, state.inputKind);
            }
          }}
          onBlur={() => setTargetDraft(null)}
        />
        <div className="target-buttons">
          <button className="btn btn-secondary btn-sm" onClick={() => load({ values, target: targetInside(values) }, state.inputKind)}>
            <Target size={13} /> Z pole
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => load({ values, target: targetOutside(values) }, state.inputKind)}>
            <Target size={13} /> Mimo pole
          </button>
        </div>
      </div>
      <div className="field">
        <div className="flabel">
          <span className="name">{t("input.size")}</span>
          <span className="num">{values.length}</span>
        </div>
        <input
          type="range"
          min={SLIDER_MIN}
          max={MAX_SIZE}
          value={Math.max(SLIDER_MIN, values.length)}
          className="slider"
          aria-label={t("input.size")}
          onChange={(event) => loadValues(makeValues(kind, Number(event.target.value)), kind)}
        />
      </div>
      <div className="field">
        <div className="flabel">
          <span className="name">{t("input.own")}</span>
        </div>
        {/* The field always shows the array in the player; key resets it when that array changes. */}
        <input
          key={current}
          type="text"
          className={shownError ? "input-mono invalid" : "input-mono"}
          defaultValue={current}
          aria-label={t("input.own")}
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
            {tx(shownError)}
          </div>
        )}
        {requiresSorted && <div className="field-note">{t("input.needsSorted")}</div>}
      </div>
      <div className="field">
        <button className="btn btn-secondary btn-sm" onClick={() => loadValues(makeValues(kind, values.length), kind)}>
          <Shuffle size={13} /> {t("input.randomArray")}
        </button>
      </div>
    </div>
  );
}
