"use client";

import { ChevronDown } from "lucide-react";
import { Dropdown } from "@/components/Dropdown";
import { usePlayer } from "@/core/player/PlayerProvider";
import { useT } from "@/i18n/client";
import { ANY_ORDER_DATASETS, makeValues, SORTED_DATASETS, targetInside } from "./datasets";
import type { SearchAlgorithm, SearchInput } from "./types";

/** The "array" button under the player: prepared arrays, and only sorted ones when the algorithm needs that. */
export function SearchDataMenu() {
  const { state, load, definition } = usePlayer();
  const { t, tx } = useT();
  const { values, target } = state.input as SearchInput;
  const hints = definition.inputHints ?? {};
  const datasets = (definition as SearchAlgorithm).requiresSorted ? SORTED_DATASETS : ANY_ORDER_DATASETS;

  return (
    <Dropdown
      wrapClassName="chip-wrap"
      buttonClassName="chip-control"
      menuClassName="chip-menu"
      label={
        <>
          <span className="lbl">array</span> {state.inputKind} · n={values.length}{" "}
          <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
        </>
      }
    >
      <div className="head">{t("data.head")}</div>
      {datasets.map((dataset) => (
        <button
          key={dataset.id}
          className={dataset.id === state.inputKind ? "on" : undefined}
          onClick={() => {
            const next = makeValues(dataset.id, values.length);
            load({ values: next, target: next.includes(target) ? target : targetInside(next) }, dataset.id);
          }}
        >
          {dataset.id} <span className="c">{tx(hints[dataset.id] ?? dataset.hint)}</span>
        </button>
      ))}
    </Dropdown>
  );
}
