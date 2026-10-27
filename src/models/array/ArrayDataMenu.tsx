"use client";

import { ChevronDown } from "lucide-react";
import { Dropdown } from "@/components/Dropdown";
import { usePlayer } from "@/core/player/PlayerProvider";
import { DATASETS, makeArray } from "./datasets";

/** The "array" button under the player: random / nearly sorted / sorted / reversed input. */
export function ArrayDataMenu() {
  const { state, load, definition } = usePlayer();
  const n = (state.input as number[]).length;
  const hints = definition.inputHints ?? {};
  const label = DATASETS.find((d) => d.id === state.inputKind)?.label ?? "custom";

  return (
    <Dropdown
      wrapClassName="chip-wrap"
      buttonClassName="chip-control"
      menuClassName="chip-menu"
      label={
        <>
          <span className="lbl">array</span> {label} · n={n}{" "}
          <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
        </>
      }
    >
      <div className="head">vstupní data</div>
      {DATASETS.map((dataset) => (
        <button
          key={dataset.id}
          className={dataset.id === state.inputKind ? "on" : undefined}
          onClick={() => load(makeArray(dataset.id, n), dataset.id)}
        >
          {dataset.label} <span className="c">{hints[dataset.id] ?? dataset.hint}</span>
        </button>
      ))}
    </Dropdown>
  );
}
