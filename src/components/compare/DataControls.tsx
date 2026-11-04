"use client";

import { useState } from "react";
import { DATASETS, formatArray, MAX_SIZE, parseArray, type DatasetKind } from "@/models/array/datasets";

const SLIDER_MIN = 5;

/** The prepared kinds of arrays; used in the "array" button and in "Nastavení dat". */
export function DatasetChoices({ kind, onChoose }: { kind: string; onChoose: (kind: DatasetKind) => void }) {
  return DATASETS.map((dataset) => (
    <button key={dataset.id} className={dataset.id === kind ? "on" : undefined} onClick={() => onChoose(dataset.id)}>
      {dataset.label} <span className="c">{dataset.hint}</span>
    </button>
  ));
}

/** Content of "Nastavení dat": kind of the array, its size and an own array. */
export function DataSettings({ input, kind, onKind, onSize, onOwn }: {
  input: number[];
  kind: string;
  onKind: (kind: DatasetKind) => void;
  onSize: (size: number) => void;
  onOwn: (values: number[]) => void;
}) {
  const current = formatArray(input);
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
      onOwn(result.values);
    }
  };

  return (
    <>
      <div className="grp">vstupní data</div>
      <div className="data-kinds">
        <DatasetChoices kind={kind} onChoose={onKind} />
      </div>
      <div className="divline" />
      <div className="data-field">
        <div className="flabel">
          <span>Velikost pole</span>
          <span className="num">{input.length}</span>
        </div>
        <input
          type="range"
          className="slider"
          min={SLIDER_MIN}
          max={MAX_SIZE}
          value={Math.max(SLIDER_MIN, input.length)}
          aria-label="Velikost pole"
          onChange={(event) => onSize(Number(event.target.value))}
        />
      </div>
      <div className="data-field">
        <div className="flabel">
          <span>Vlastní vstup</span>
        </div>
        {/* The field always shows the array being compared; key resets it when that array changes. */}
        <input
          key={current}
          type="text"
          className={shownError ? "input-mono invalid" : "input-mono"}
          defaultValue={current}
          aria-label="Vlastní vstup"
          aria-invalid={shownError !== null}
          spellCheck={false}
          onBlur={(event) => applyText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyText(event.currentTarget.value);
          }}
        />
        {shownError && <div className="field-error">{shownError}</div>}
      </div>
    </>
  );
}
