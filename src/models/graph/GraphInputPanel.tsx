"use client";

import { Pencil, Shuffle } from "lucide-react";
import { usePlayer } from "@/core/player/PlayerProvider";
import { useT } from "@/i18n/client";
import { MAX_RANDOM_NODES, maxRandomEdges, MIN_RANDOM_NODES, randomGraph, randomWeightedGraph } from "./presets";
import type { GraphAlgorithm, GraphInput } from "./types";

/**
 * Side panel "Input" of the graph model: the start vertex and a random graph
 * with a chosen number of vertices and edges.
 */
export function GraphInputPanel() {
  const { state, load, definition } = usePlayer();
  const { t } = useT();
  const { weighted } = definition as GraphAlgorithm;
  const { graph, start } = state.input as GraphInput;
  const n = graph.nodes.length;
  const m = graph.edges.length;

  // The sliders describe the current graph, kept inside what a random graph can have.
  const nodesValue = Math.min(MAX_RANDOM_NODES, Math.max(MIN_RANDOM_NODES, n));
  const minEdges = nodesValue - 1;
  const maxEdges = maxRandomEdges(nodesValue);
  const edgesValue = Math.min(maxEdges, Math.max(minEdges, m));

  /** A new random graph; the start vertex is kept when the new graph has it. */
  const generate = (nodeCount: number, edgeCount: number) => {
    const next = weighted ? randomWeightedGraph(weighted, nodeCount, edgeCount) : randomGraph(nodeCount, edgeCount);
    load({ graph: next, start: next.nodes.some((v) => v.id === start) ? start : "A" }, "random");
  };

  return (
    <div className="panel-card">
      <div className="panel-label">Input</div>
      <div className="field">
        <div className="flabel">
          <span className="name">{t("input.start")}</span>
          <span className="num">{start}</span>
        </div>
        <div className="vertex-picker" role="group" aria-label={t("input.start")}>
          {graph.nodes.map(({ id }) => (
            <button
              key={id}
              className={id === start ? "on" : undefined}
              aria-pressed={id === start}
              onClick={() => load({ graph, start: id }, state.inputKind)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <div className="flabel">
          <span className="name">{t("input.vertices")}</span>
          <span className="num">{n}</span>
        </div>
        <input
          type="range"
          className="slider"
          min={MIN_RANDOM_NODES}
          max={MAX_RANDOM_NODES}
          value={nodesValue}
          aria-label={t("input.verticesAria")}
          onChange={(event) => {
            const nodes = Number(event.target.value);
            // Keep the number of edges if the new number of vertices allows it.
            generate(nodes, Math.min(maxRandomEdges(nodes), Math.max(nodes - 1, m)));
          }}
        />
      </div>
      <div className="field">
        <div className="flabel">
          <span className="name">{t("input.edges")}</span>
          <span className="num">{m}</span>
        </div>
        <input
          type="range"
          className="slider"
          min={minEdges}
          max={maxEdges}
          value={edgesValue}
          disabled={minEdges === maxEdges}
          aria-label={t("input.edgesAria")}
          onChange={(event) => generate(nodesValue, Number(event.target.value))}
        />
        <div className="field-note">{t("input.edgesRange", { min: minEdges, max: maxEdges })}</div>
      </div>
      <div className="field">
        <button className="btn btn-secondary btn-sm" onClick={() => generate(nodesValue, edgesValue)}>
          <Shuffle size={13} /> {t("input.randomGraph")}
        </button>
        <div className="field-note">
          <Pencil size={11} /> {t("input.editHint")}
        </div>
      </div>
    </div>
  );
}
