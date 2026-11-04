import type { AlgorithmDefinition, Step } from "@/core/types";

/*
 * The "graph" data model: vertices and edges drawn as an SVG picture
 * (BFS, DFS, later Dijkstra and trees). Graphs are undirected.
 */

export interface GraphNode {
  /** Name of the vertex, also its label: "A", "B", … */
  id: string;
  /** Position in the picture (the SVG is 760 × 280). */
  x: number;
  y: number;
}

/** An edge [from, to] or, in a weighted graph, [from, to, weight]. */
export type GraphEdge = [string, string, number?];

export interface Graph {
  nodes: GraphNode[];
  /** Without `directed`, [a, b] and [b, a] are the same edge. */
  edges: GraphEdge[];
  /** Edges lead only from the first vertex to the second one. */
  directed?: boolean;
}

/** Input of a graph algorithm: the graph and the vertex to start from. */
export interface GraphInput {
  graph: Graph;
  start: string;
}

/**
 * How a vertex is coloured. Vertices without a mark are grey (not reached yet).
 * frontier — found, waiting (in the queue / on the stack); active — being processed now;
 * compared — the neighbour being checked; done — processed.
 */
export type NodeMark = "frontier" | "active" | "compared" | "done";

/** How an edge is drawn: tree — a vertex was found through it; active — being checked now. */
export type EdgeMark = "tree" | "active";

/** Snapshot of the graph after one step. */
export interface GraphState {
  graph: Graph;
  marks: Partial<Record<string, NodeMark>>;
  /** Marks of edges by edgeKey(a, b). */
  edgeMarks: Partial<Record<string, EdgeMark>>;
  /** Small label next to a vertex, e.g. the distance "d=2". */
  badges: Partial<Record<string, string>>;
  /** Lists shown under the picture, e.g. the queue and the visit order. */
  lists: GraphList[];
}

/** A list under the picture: vertices, optionally shown with their own text (e.g. "B:4"). */
export interface GraphList {
  label: string;
  items: string[];
  texts?: string[];
}

/** What happened in one step, machine-readable. */
export type GraphEvent =
  | { type: "start"; node: string }
  /** The end. Shortest-path algorithms also report the result. */
  | {
      type: "done";
      distances?: Record<string, number>;
      previous?: Record<string, string | null>;
      negativeCycle?: boolean;
    }
  /** The algorithm starts processing `node` (taken from the queue / entered by recursion). */
  | { type: "visit"; node: string }
  /** The edge from → to is being checked. */
  | { type: "examine"; from: string; to: string }
  /** `node` was found through `from` and is waiting (BFS: put into the queue). */
  | { type: "discover"; node: string; from: string }
  /** `node` and everything reachable from it is processed (DFS: the recursion returns). */
  | { type: "finish"; node: string }
  /** A shorter way to `to` was found through `from`. */
  | { type: "relax"; from: string; to: string; distance: number }
  /** A new pass over all edges begins (Bellman–Ford). */
  | { type: "pass"; number: number };

export type GraphStep = Step<GraphState, GraphEvent>;

/** A prepared graph offered on the "graph" button. */
export interface GraphPreset {
  id: string;
  label: string;
  hint: string;
  graph: Graph;
}

/** What a weighted graph algorithm accepts: the editor and the random graphs follow this. */
export interface WeightOptions {
  directed: boolean;
  minWeight: number;
  maxWeight: number;
  presets: GraphPreset[];
}

/** An algorithm on a graph: its input is GraphInput and its steps are GraphSteps. */
export type GraphAlgorithm<Slug extends string = string> = AlgorithmDefinition<GraphInput, GraphState, GraphEvent> & {
  slug: Slug;
  model: "graph";
  /** Present for algorithms on weighted graphs. */
  weighted?: WeightOptions;
};

/** Declares an algorithm that works on a graph (keeps the slug as a literal type, like defineArrayAlgorithm). */
export function defineGraphAlgorithm<const Slug extends string>(
  definition: Omit<GraphAlgorithm<Slug>, "model">,
): GraphAlgorithm<Slug> {
  return { ...definition, model: "graph" };
}
