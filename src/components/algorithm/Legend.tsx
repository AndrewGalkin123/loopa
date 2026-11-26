"use client";

import type { AlgorithmDefinition, Model } from "@/core/types";
import { usePlayer } from "@/core/player/PlayerProvider";
import { useT } from "@/i18n/client";

/** Colour legend: the marks the algorithm uses and what they mean for it. */
export function Legend({ definition, model }: { definition: AlgorithmDefinition; model: Model }) {
  const { tx } = useT();
  return (
    <div className="panel-card">
      <div className="panel-label">Color legend</div>
      <div className="legend">
        {definition.legend.map((mark) => (
          <div className="item" key={mark}>
            <span
              className="sw"
              style={{ background: model.legend[mark].color, opacity: model.legend[mark].dim ? 0.35 : undefined }}
            />{" "}
            {mark} <span className="desc">{tx(definition.legendDescriptions?.[mark] ?? model.legend[mark].desc)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The legend of the algorithm in the player. */
export function PlayerLegend() {
  const { definition, model } = usePlayer();
  return <Legend definition={definition} model={model} />;
}
