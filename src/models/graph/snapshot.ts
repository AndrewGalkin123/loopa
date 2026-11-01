import type { NotePart } from "@/core/types";
import type { EdgeMark, Graph, GraphState, NodeMark } from "./types";

/* Helpers for algorithms on graphs: neighbours, snapshots and status lines. */

/** Key of an undirected edge: the same for (a, b) and (b, a). */
export function edgeKey(a: string, b: string): string {
  return a < b ? `${a}–${b}` : `${b}–${a}`;
}

/** Neighbours of a vertex in alphabetical order (the order used in the research tests). */
export function neighbours(graph: Graph, node: string): string[] {
  return graph.edges
    .filter(([a, b]) => a === node || b === node)
    .map(([a, b]) => (a === node ? b : a))
    .sort();
}

/** What an algorithm wants highlighted in one step. */
export interface GraphHighlight {
  /** Vertices found and waiting (queue / stack). */
  frontier?: string[];
  /** The vertex being processed. */
  active?: string;
  /** The neighbour being checked. */
  compared?: string;
  /** Processed vertices. */
  done?: string[];
  /** Edges through which vertices were found, as [from, to]. */
  treeEdges?: [string, string][];
  /** The edge being checked. */
  activeEdge?: [string, string];
  badges?: Partial<Record<string, string>>;
  lists?: { label: string; items: string[] }[];
}

/**
 * Snapshot of the graph with marks. One vertex has one mark; when several apply,
 * the first one in this order wins: active, compared, frontier, done.
 */
export function snapshot(graph: Graph, highlight: GraphHighlight = {}): GraphState {
  const { frontier = [], active, compared, done = [], treeEdges = [], activeEdge } = highlight;

  const marks: Partial<Record<string, NodeMark>> = {};
  for (const { id } of graph.nodes) {
    if (id === active) marks[id] = "active";
    else if (id === compared) marks[id] = "compared";
    else if (frontier.includes(id)) marks[id] = "frontier";
    else if (done.includes(id)) marks[id] = "done";
  }

  const edgeMarks: Partial<Record<string, EdgeMark>> = {};
  for (const [a, b] of treeEdges) edgeMarks[edgeKey(a, b)] = "tree";
  if (activeEdge) edgeMarks[edgeKey(...activeEdge)] = "active";

  return {
    graph,
    marks,
    edgeMarks,
    badges: { ...highlight.badges },
    lists: (highlight.lists ?? []).map((list) => ({ label: list.label, items: [...list.items] })),
  };
}

/** A vertex name in the colour of a mark, for the status line. */
export function vertex(id: string, mark: NodeMark): NotePart {
  return { text: id, mark };
}
