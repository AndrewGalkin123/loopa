"use client";

import { findAlgorithm } from "@/algorithms/registry";
import { Legend } from "@/components/algorithm/Legend";
import { Note } from "@/core/player/Note";
import type { AlgorithmDefinition } from "@/core/types";
import { MODELS } from "@/models";

/**
 * The control condition of the research: instead of the player, still pictures of the
 * key moments of the same run (the same input as in the trainer), drawn by the same model.
 */
export function KeyStates({ slug }: { slug: string }) {
  const definition: AlgorithmDefinition = findAlgorithm(slug)!;
  const model = MODELS[definition.model];
  const steps = definition.trace(definition.initialInput);
  const states = definition.keyStates?.(steps) ?? [];

  return (
    <section className="key-states">
      <div className="key-head">
        <div className="block-title">Průběh algoritmu</div>
        <p>Klíčové okamžiky jednoho běhu, postupně zleva doprava a shora dolů.</p>
      </div>
      <div className="key-layout">
        {/* A graph needs the full width to stay readable; bars fit two or three in a row. */}
        <div className={`key-grid ${definition.model}`}>
          {states.map((state, i) => {
            const step = steps[state.step];
            return (
              <figure className="key-state" key={state.step}>
                <figcaption>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span> <Note parts={state.caption} />
                </figcaption>
                <div className="key-picture">
                  <model.View state={step.state} />
                </div>
                <div className="key-counters">
                  {definition.counters.map((c) => `${c.label} ${step.counters[c.key] ?? 0}`).join(" · ")}
                </div>
              </figure>
            );
          })}
        </div>
        <aside className="side-panel">
          <Legend definition={definition} model={model} />
        </aside>
      </div>
    </section>
  );
}
