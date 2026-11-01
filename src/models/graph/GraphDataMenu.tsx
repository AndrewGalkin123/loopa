"use client";

import { ChevronDown } from "lucide-react";
import { Dropdown } from "@/components/Dropdown";
import { usePlayer } from "@/core/player/PlayerProvider";
import { PRESETS, randomGraph } from "./presets";
import type { Graph, GraphInput } from "./types";

/** The "graph" button under the player: prepared graphs and a random one. */
export function GraphDataMenu() {
  const { state, load, definition } = usePlayer();
  const hints = definition.inputHints ?? {};
  const { start } = state.input as GraphInput;
  // Keep the chosen start vertex if the new graph has it.
  const startIn = (graph: Graph) => (graph.nodes.some((n) => n.id === start) ? start : graph.nodes[0].id);
  // A prepared graph shows its name; otherwise "random" or "custom" (changed in the editor).
  const label = PRESETS.find((p) => p.id === state.inputKind)?.label ?? state.inputKind;

  return (
    <Dropdown
      wrapClassName="chip-wrap"
      buttonClassName="chip-control"
      menuClassName="chip-menu"
      label={
        <>
          <span className="lbl">graph</span> {label}{" "}
          <ChevronDown size={12} style={{ color: "var(--color-text-subtle)" }} />
        </>
      }
    >
      <div className="head">graf</div>
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          className={preset.id === state.inputKind ? "on" : undefined}
          onClick={() => load({ graph: preset.graph, start: startIn(preset.graph) }, preset.id)}
        >
          {preset.label} <span className="c">{hints[preset.id] ?? preset.hint}</span>
        </button>
      ))}
      <button
        className={state.inputKind === "random" ? "on" : undefined}
        onClick={() => {
          const graph = randomGraph();
          load({ graph, start: startIn(graph) }, "random");
        }}
      >
        random <span className="c">{hints.random ?? "náhodný souvislý graf"}</span>
      </button>
    </Dropdown>
  );
}
