"use client";

import { useState } from "react";
import { useT } from "@/i18n/client";
import type { Text } from "@/i18n/config";
import { DATASETS, formatArray, MAX_SIZE, parseArray, type DatasetKind } from "@/models/array/datasets";

const SLIDER_MIN = 5;

/** The prepared kinds of arrays; used in the "array" button and in "Nastavení dat". */
export function DatasetChoices({ kind, onChoose }: { kind: string; onChoose: (kind: DatasetKind) => void }) {
  const { tx } = useT();
  return DATASETS.map((dataset) => (
    <button key={dataset.id} className={dataset.id === kind ? "on" : undefined} onClick={() => onChoose(dataset.id)}>
      {dataset.label} <span className="c">{tx(dataset.hint)}</span>
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
  const { t, tx } = useT();
  const current = formatArray(input);
  // The error belongs to the array it was typed over; once the array changes, it disappears.
  const [error, setError] = useState<{ over: string; message: Text } | null>(null);
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
      <div className="grp">{t("data.head")}</div>
      <div className="data-kinds">
        <DatasetChoices kind={kind} onChoose={onKind} />
      </div>
      <div className="divline" />
      <div className="data-field">
        <div className="flabel">
          <span>{t("input.size")}</span>
          <span className="num">{input.length}</span>
        </div>
        <input
          type="range"
          className="slider"
          min={SLIDER_MIN}
          max={MAX_SIZE}
          value={Math.max(SLIDER_MIN, input.length)}
          aria-label={t("input.size")}
          onChange={(event) => onSize(Number(event.target.value))}
        />
      </div>
      <div className="data-field">
        <div className="flabel">
          <span>{t("input.own")}</span>
        </div>
        {/* The field always shows the array being compared; key resets it when that array changes. */}
        <input
          key={current}
          type="text"
          className={shownError ? "input-mono invalid" : "input-mono"}
          defaultValue={current}
          aria-label={t("input.own")}
          aria-invalid={shownError !== null}
          spellCheck={false}
          onBlur={(event) => applyText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyText(event.currentTarget.value);
          }}
        />
        {shownError && <div className="field-error">{tx(shownError)}</div>}
      </div>
    </>
  );
}
