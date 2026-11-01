"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { usePlayer } from "@/core/player/PlayerProvider";
import { addNode, MAX_NODES, moveNode, removeNode, toggleEdge } from "./edit";
import { edgeKey } from "./snapshot";
import type { GraphInput, GraphState } from "./types";

const RADIUS = 18;
/** A press that moves less than this (in screen pixels) is a click, not a drag. */
const DRAG_THRESHOLD = 4;

/**
 * Player stage of the graph model. Normally it shows the step: coloured vertices
 * and edges, distances and the queue / stack. In edit mode ("Upravit graf") the
 * graph itself can be changed with the mouse; every change reruns the algorithm.
 */
export function GraphView({ state }: { state: unknown }) {
  const { state: player, load, dispatch } = usePlayer();
  const input = player.input as GraphInput;
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
      } else if (event.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing, selected, input, load]);

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
    } else {
      // A second vertex: add the edge between them, or remove it if it exists.
      if (selected !== id) edit(toggleEdge(input, selected, id));
      setSelected(null);
    }
    setDrag(null);
  };

  // A click on an empty place adds a vertex (or just cancels the selection).
  const onBackgroundClick = (event: MouseEvent) => {
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

        {graph.edges.map(([a, b]) => {
          const key = edgeKey(a, b);
          const from = position.get(a)!;
          const to = position.get(b)!;
          return (
            <g key={key}>
              <line className={`edge ${edgeMarks[key] ?? ""}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
              {/* A wide invisible line makes the thin edge easy to click. */}
              {editing && (
                <line
                  className="edge-hit"
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  onClick={() => edit(toggleEdge(input, a, b))}
                >
                  <title>Smazat hranu {key}</title>
                </line>
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
          <li>klik na hranu — smazat</li>
          <li>táhni vrchol — přesunout</li>
          <li>Delete — smazat vybraný vrchol</li>
        </ul>
      ) : (
        <div className="graph-lists">
          {lists.map((list) => (
            <div className="graph-list" key={list.label}>
              <span className="lbl">{list.label}</span>
              {list.items.length === 0 && <span className="empty">—</span>}
              {list.items.map((id, i) => (
                <span key={`${id}-${i}`} className={`item ${marks[id] ?? ""}`}>
                  {id}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
