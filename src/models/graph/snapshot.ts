import type { NotePart } from "@/core/types";
import type { EdgeMark, Graph, GraphList, GraphState, NodeMark } from "./types";

/* Helpers for algorithms on graphs: neighbours, snapshots and status lines. */

/** Key of an edge: the same for (a, b) and (b, a), unless the graph is directed. */
export function edgeKey(a: string, b: string, directed = false): string {
  if (directed) return `${a}→${b}`;
  return a < b ? `${a}–${b}` : `${b}–${a}`;
}

/** Neighbours of a vertex in alphabetical order (the order used in the research tests). */
export function neighbours(graph: Graph, node: string): string[] {
  return graph.edges
    .filter(([a, b]) => a === node || b === node)
    .map(([a, b]) => (a === node ? b : a))
    .sort();
}

/** Edges leaving a vertex with their weights, ordered by the neighbour's name. */
export function edgesFrom(graph: Graph, node: string): { to: string; weight: number }[] {
  const result: { to: string; weight: number }[] = [];
  for (const [a, b, weight = 1] of graph.edges) {
    if (a === node) result.push({ to: b, weight });
    else if (!graph.directed && b === node) result.push({ to: a, weight });
  }
  return result.sort((x, y) => x.to.localeCompare(y.to));
}

/** All edges in alphabetical order, the order of a pass of Bellman–Ford. */
export function sortedEdges(graph: Graph): { from: string; to: string; weight: number }[] {
  return graph.edges
    .map(([from, to, weight = 1]) => ({ from, to, weight }))
    .sort((x, y) => x.from.localeCompare(y.from) || x.to.localeCompare(y.to));
}

/** The labels "d=…" of all vertices. */
export function distanceBadges(distance: Record<string, number>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(distance).map(([id, d]) => [id, `d=${d === Infinity ? "∞" : d}`]),
  );
}

/** The edges predecessor → vertex: the current tree of shortest paths. */
export function treeOf(previous: Record<string, string | null>): [string, string][] {
  return Object.entries(previous).flatMap(([v, p]) => (p ? [[p, v] as [string, string]] : []));
}

/** The vertices of a cycle in the predecessor links reached from `node`, if there is one. */
export function predecessorCycle(previous: Record<string, string | null>, node: string): string[] | null {
  const seen = new Set<string>();
  let current: string | null = node;
  while (current && !seen.has(current)) {
    seen.add(current);
    current = previous[current] ?? null;
  }
  if (!current) return null;
  const cycle = [current];
  for (let v = previous[current]!; v !== current; v = previous[v]!) cycle.push(v);
  return cycle.reverse();
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
  /** A negative cycle: its vertices in order. */
  cycle?: string[];
  badges?: Partial<Record<string, string>>;
  lists?: GraphList[];
}

/**
 * Snapshot of the graph with marks. One vertex has one mark; when several apply,
 * the first one in this order wins: cycle, active, compared, frontier, done.
 */
export function snapshot(graph: Graph, highlight: GraphHighlight = {}): GraphState {
  const { frontier = [], active, compared, done = [], treeEdges = [], activeEdge, cycle = [] } = highlight;
  const { directed } = graph;

  const marks: Partial<Record<string, NodeMark>> = {};
  for (const { id } of graph.nodes) {
    if (cycle.includes(id)) marks[id] = "compared";
    else if (id === active) marks[id] = "active";
    else if (id === compared) marks[id] = "compared";
    else if (frontier.includes(id)) marks[id] = "frontier";
    else if (done.includes(id)) marks[id] = "done";
  }

  const edgeMarks: Partial<Record<string, EdgeMark>> = {};
  for (const [a, b] of treeEdges) edgeMarks[edgeKey(a, b, directed)] = "tree";
  if (activeEdge) edgeMarks[edgeKey(activeEdge[0], activeEdge[1], directed)] = "active";
  cycle.forEach((v, i) => {
    edgeMarks[edgeKey(v, cycle[(i + 1) % cycle.length], directed)] = "active";
  });

  return {
    graph,
    marks,
    edgeMarks,
    badges: { ...highlight.badges },
    lists: (highlight.lists ?? []).map((list) => ({ ...list, items: [...list.items] })),
  };
}

/** A vertex name in the colour of a mark, for the status line. */
export function vertex(id: string, mark: NodeMark): NotePart {
  return { text: id, mark };
}
