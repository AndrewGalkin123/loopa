import type { Graph, GraphInput } from "./types";

/*
 * Changes of a graph made in the editor. Pure functions: each one returns
 * a new GraphInput and leaves the old one untouched (the player keeps it in its state).
 */

/** At most this many vertices (letters A–P), so that the picture stays readable. */
export const MAX_NODES = 16;

/** The picture is 760 × 280; vertex centres stay this far from its edges. */
const WIDTH = 760;
const HEIGHT = 280;
const MARGIN_X = 26;
const MARGIN_TOP = 34; // room for the distance label above a vertex
const MARGIN_BOTTOM = 24;
/** A new vertex must not be closer than this to an existing one. */
const MIN_DISTANCE = 44;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Keeps a position inside the picture. */
export function clampPosition(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.round(Math.min(WIDTH - MARGIN_X, Math.max(MARGIN_X, x))),
    y: Math.round(Math.min(HEIGHT - MARGIN_BOTTOM, Math.max(MARGIN_TOP, y))),
  };
}

/** The first letter not used by any vertex, or undefined when the graph is full. */
export function nextFreeId(graph: Graph): string | undefined {
  if (graph.nodes.length >= MAX_NODES) return undefined;
  return [...LETTERS].find((letter) => !graph.nodes.some((n) => n.id === letter));
}

/** Adds a vertex at (x, y). Nothing happens when the graph is full or the place is taken. */
export function addNode(input: GraphInput, x: number, y: number): GraphInput {
  const id = nextFreeId(input.graph);
  const position = clampPosition(x, y);
  const tooClose = input.graph.nodes.some((n) => Math.hypot(n.x - position.x, n.y - position.y) < MIN_DISTANCE);
  if (!id || tooClose) return input;
  const nodes = [...input.graph.nodes, { id, ...position }].sort((a, b) => a.id.localeCompare(b.id));
  return { ...input, graph: { ...input.graph, nodes } };
}

/**
 * Removes a vertex and all its edges. The last vertex cannot be removed;
 * when the start vertex is removed, the first remaining one becomes the start.
 */
export function removeNode(input: GraphInput, id: string): GraphInput {
  if (input.graph.nodes.length <= 1) return input;
  const nodes = input.graph.nodes.filter((n) => n.id !== id);
  const edges = input.graph.edges.filter(([a, b]) => a !== id && b !== id);
  const start = input.start === id ? nodes[0].id : input.start;
  return { graph: { nodes, edges }, start };
}

/** Adds the edge a–b, or removes it when it is already there. A vertex cannot be joined to itself. */
export function toggleEdge(input: GraphInput, a: string, b: string): GraphInput {
  if (a === b) return input;
  const same = ([x, y]: [string, string]) => (x === a && y === b) || (x === b && y === a);
  const exists = input.graph.edges.some(same);
  const edges: [string, string][] = exists
    ? input.graph.edges.filter((edge) => !same(edge))
    : [...input.graph.edges, a < b ? [a, b] : [b, a]];
  return { ...input, graph: { ...input.graph, edges } };
}

/** Moves a vertex to (x, y), kept inside the picture. */
export function moveNode(input: GraphInput, id: string, x: number, y: number): GraphInput {
  const position = clampPosition(x, y);
  const nodes = input.graph.nodes.map((n) => (n.id === id ? { ...n, ...position } : n));
  return { ...input, graph: { ...input.graph, nodes } };
}
