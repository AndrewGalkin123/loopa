"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { usePlayer } from "@/core/player/PlayerProvider";
import { addNode, MAX_NODES, moveNode, removeNode, setWeight, toggleEdge } from "./edit";
import { edgeKey } from "./snapshot";
import type { GraphAlgorithm, GraphInput, GraphState } from "./types";

const RADIUS = 18;
/** A press that moves less than this (in screen pixels) is a click, not a drag. */
const DRAG_THRESHOLD = 4;

/**
 * Player stage of the graph model. Normally it shows the step: coloured vertices
 * and edges, distances and the queue / stack. In edit mode ("Upravit graf") the
 * graph itself can be changed with the mouse; every change reruns the algorithm.
 */
export function GraphView({ state }: { state: unknown }) {
  const { state: player, load, dispatch, definition } = usePlayer();
  const input = player.input as GraphInput;
  const { weighted } = definition as GraphAlgorithm;
  // Weighted graphs: the selected edge, whose weight can be changed in the toolbar.
  const [selectedEdge, setSelectedEdge] = useState<[string, string] | null>(null);
  const [weightDraft, setWeightDraft] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; fromX: number; fromY: number; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const edit = (next: GraphInput) => {
    if (next !== input) load(next, "custom");
  };

  // In edit mode: Delete / Backspace removes the selected vertex, Esc cancels the selection.
  useEffect(() => {
    if (!editing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest("input, textarea")) return;
      if ((event.key === "Delete" || event.key === "Backspace") && selected) {
        event.preventDefault();
        load(removeNode(input, selected), "custom");
        setSelected(null);
      } else if ((event.key === "Delete" || event.key === "Backspace") && selectedEdge) {
        event.preventDefault();
        load(toggleEdge(input, selectedEdge[0], selectedEdge[1]), "custom");
        setSelectedEdge(null);
      } else if (event.key === "Escape") {
        setSelected(null);
        setSelectedEdge(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing, selected, selectedEdge, input, load]);

  /** Screen point → coordinates of the 760 × 280 picture. */
  const toPicture = (clientX: number, clientY: number) => {
    const point = new DOMPoint(clientX, clientY).matrixTransform(svgRef.current!.getScreenCTM()!.inverse());
    return { x: point.x, y: point.y };
  };

  const startEditing = () => {
    dispatch({ type: "reset" }); // stop the playback and show the graph from the first step
    setEditing(true);
  };
  const stopEditing = () => {
    setEditing(false);
    setSelected(null);
    setSelectedEdge(null);
  };

  // Vertex: press → either a drag (move it) or a click (select / join with the selected one).
  const onNodeDown = (event: PointerEvent, id: string, x: number, y: number) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ id, x, y, fromX: event.clientX, fromY: event.clientY, moved: false });
  };
  const onNodeMove = (event: PointerEvent) => {
    if (!drag) return;
    const moved = drag.moved || Math.hypot(event.clientX - drag.fromX, event.clientY - drag.fromY) > DRAG_THRESHOLD;
    setDrag({ ...drag, ...toPicture(event.clientX, event.clientY), moved });
  };
  const onNodeUp = (id: string) => {
    if (!drag) return;
    if (drag.moved) {
      edit(moveNode(input, id, drag.x, drag.y));
    } else if (selected === null) {
      setSelected(id);
      setSelectedEdge(null);
    } else {
      // A second vertex: add the edge between them, or remove it if it exists.
      if (selected !== id) {
        const exists = input.graph.edges.some(([a, b]) => (a === selected && b === id) || (a === id && b === selected));
        edit(toggleEdge(input, selected, id, weighted ? Math.max(weighted.minWeight, 1) : undefined));
        // A new weighted edge is selected right away, so its weight can be typed in.
        if (weighted && !exists) {
          setSelectedEdge([selected, id]);
          setWeightDraft(null);
        }
      }
      setSelected(null);
    }
    setDrag(null);
  };

  // A click on an empty place adds a vertex (or just cancels the selection).
  const onBackgroundClick = (event: MouseEvent) => {
    if (selectedEdge) return setSelectedEdge(null);
    if (selected) return setSelected(null);
    const { x, y } = toPicture(event.clientX, event.clientY);
    edit(addNode(input, x, y));
  };

  // What to draw: the step, or in edit mode the bare graph (with a vertex being dragged moved).
  const view: GraphState = editing
    ? {
        graph: drag?.moved ? moveNode(input, drag.id, drag.x, drag.y).graph : input.graph,
        marks: selected ? { [selected]: "active" } : {},
        edgeMarks: {},
        badges: {},
        lists: [],
      }
    : (state as GraphState);
  const { graph, marks, edgeMarks, badges, lists } = view;
  const position = new Map(graph.nodes.map((n) => [n.id, n]));
  const { directed } = graph;
  const chosenEdge = selectedEdge && graph.edges.find(
    ([a, b]) => (a === selectedEdge[0] && b === selectedEdge[1]) || (a === selectedEdge[1] && b === selectedEdge[0]),
  );

  return (
    <div className={editing ? "graph-view editing" : "graph-view"}>
      <div className="graph-toolbar">
        {editing && selected && (
          <button
            className="btn btn-secondary btn-sm"
            disabled={graph.nodes.length <= 1}
            onClick={() => {
              edit(removeNode(input, selected));
              setSelected(null);
            }}
          >
            <Trash2 size={13} /> Smazat vrchol {selected}
          </button>
        )}
        {editing && chosenEdge && weighted && (
          <>
            <label className="weight-field">
              váha {edgeKey(chosenEdge[0], chosenEdge[1], directed)}
              <input
                type="number"
                className="input-mono"
                min={weighted.minWeight}
                max={weighted.maxWeight}
                value={weightDraft ?? chosenEdge[2] ?? 1}
                onChange={(event) => {
                  setWeightDraft(event.target.value);
                  const value = Number(event.target.value);
                  if (
                    event.target.value !== "" &&
                    Number.isInteger(value) &&
                    value >= weighted.minWeight &&
                    value <= weighted.maxWeight
                  ) {
                    edit(setWeight(input, chosenEdge[0], chosenEdge[1], value));
                  }
                }}
                onBlur={() => setWeightDraft(null)}
              />
            </label>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                edit(toggleEdge(input, chosenEdge[0], chosenEdge[1]));
                setSelectedEdge(null);
              }}
            >
              <Trash2 size={13} /> Smazat hranu
            </button>
          </>
        )}
        <button className="btn btn-secondary btn-sm" onClick={editing ? stopEditing : startEditing}>
          {editing ? (
            <>
              <Check size={13} /> Hotovo
            </>
          ) : (
            <>
              <Pencil size={13} /> Upravit graf
            </>
          )}
        </button>
      </div>

      <svg
        ref={svgRef}
        className="graph-svg"
        viewBox="0 0 760 280"
        aria-hidden={!editing}
        aria-label={editing ? "Editor grafu" : undefined}
      >
        {editing && <rect className="edit-area" x={0} y={0} width={760} height={280} onClick={onBackgroundClick} />}

        {graph.edges.map(([a, b, weight]) => {
          const key = edgeKey(a, b, directed);
          const from = position.get(a)!;
          const to = position.get(b)!;
          const mark = edgeMarks[key] ?? "";
          // The arrow ends at the edge of the target vertex.
          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          const tipX = to.x - Math.cos(angle) * (RADIUS + 2);
          const tipY = to.y - Math.sin(angle) * (RADIUS + 2);
          const isChosen = chosenEdge && chosenEdge[0] === a && chosenEdge[1] === b;
          return (
            <g key={key}>
              <line className={`edge ${mark} ${isChosen ? "chosen" : ""}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
              {directed && (
                <polygon
                  className={`arrow ${mark}`}
                  points="0,0 -11,-5 -11,5"
                  transform={`translate(${tipX} ${tipY}) rotate(${(angle * 180) / Math.PI})`}
                />
              )}
              {/* A wide invisible line makes the thin edge easy to click. */}
              {editing && (
                <line
                  className="edge-hit"
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  onClick={() => {
                    if (weighted) {
                      setSelectedEdge([a, b]);
                      setSelected(null);
                      setWeightDraft(null);
                    } else {
                      edit(toggleEdge(input, a, b));
                    }
                  }}
                >
                  <title>{weighted ? `Upravit hranu ${key}` : `Smazat hranu ${key}`}</title>
                </line>
              )}
              {weight !== undefined && (
                <text
                  className={weight < 0 ? "weight negative" : "weight"}
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2}
                  dy="0.35em"
                >
                  {weight}
                </text>
              )}
            </g>
          );
        })}

        {graph.nodes.map((n) => (
          <g
            key={n.id}
            className={`node ${marks[n.id] ?? ""}`}
            transform={`translate(${n.x} ${n.y})`}
            onPointerDown={editing ? (event) => onNodeDown(event, n.id, n.x, n.y) : undefined}
            onPointerMove={editing ? onNodeMove : undefined}
            onPointerUp={editing ? () => onNodeUp(n.id) : undefined}
          >
            <circle r={RADIUS} />
            <text className="label" dy="0.35em">
              {n.id}
            </text>
            {badges[n.id] && (
              <text className="badge" x={RADIUS + 4} y={-RADIUS + 2}>
                {badges[n.id]}
              </text>
            )}
          </g>
        ))}
      </svg>

      {editing ? (
        <ul className="graph-hint">
          <li>klik do plochy — nový vrchol{graph.nodes.length >= MAX_NODES ? ` (max ${MAX_NODES})` : ""}</li>
          <li>klik na dva vrcholy — přidat / odebrat hranu</li>
          <li>{weighted ? "klik na hranu — změnit váhu nebo smazat" : "klik na hranu — smazat"}</li>
          <li>táhni vrchol — přesunout</li>
          <li>{weighted ? "Delete — smazat vybraný vrchol nebo hranu" : "Delete — smazat vybraný vrchol"}</li>
          {directed && <li>hrana vede od prvního vrcholu k druhému</li>}
        </ul>
      ) : (
        <div className="graph-lists">
          {lists.map((list) => (
            <div className="graph-list" key={list.label}>
              <span className="lbl">{list.label}</span>
              {list.items.length === 0 && <span className="empty">—</span>}
              {list.items.map((id, i) => (
                <span key={`${id}-${i}`} className={`item ${marks[id] ?? ""}`}>
                  {list.texts?.[i] ?? id}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
