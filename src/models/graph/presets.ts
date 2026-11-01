import type { Graph, GraphNode } from "./types";

/*
 * Prepared graphs for the player. Positions are in the 760 × 280 SVG of GraphView.
 * None of them is a graph from the research tests (docs/research/02-testy-pre-post.md).
 */

const node = (id: string, x: number, y: number): GraphNode => ({ id, x, y });

export const PRESETS: { id: string; label: string; hint: string; graph: Graph }[] = [
  {
    id: "cycles",
    label: "cycles",
    hint: "graf s cykly",
    graph: {
      nodes: [
        node("A", 70, 140),
        node("B", 220, 60),
        node("C", 220, 220),
        node("D", 380, 140),
        node("E", 540, 60),
        node("F", 540, 220),
        node("G", 690, 140),
        node("H", 380, 245),
      ],
      edges: [
        ["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "D"],
        ["C", "H"], ["D", "F"], ["E", "G"], ["F", "G"], ["F", "H"],
      ],
    },
  },
  {
    id: "tree",
    label: "tree",
    hint: "strom",
    graph: {
      nodes: [
        node("A", 380, 45),
        node("B", 200, 130),
        node("C", 560, 130),
        node("D", 110, 225),
        node("E", 290, 225),
        node("F", 470, 225),
        node("G", 650, 225),
      ],
      edges: [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]],
    },
  },
  {
    id: "grid",
    label: "grid",
    hint: "mřížka 3 × 3",
    graph: {
      nodes: [
        node("A", 230, 50), node("B", 380, 50), node("C", 530, 50),
        node("D", 230, 140), node("E", 380, 140), node("F", 530, 140),
        node("G", 230, 230), node("H", 380, 230), node("I", 530, 230),
      ],
      edges: [
        ["A", "B"], ["B", "C"], ["D", "E"], ["E", "F"], ["G", "H"], ["H", "I"],
        ["A", "D"], ["D", "G"], ["B", "E"], ["E", "H"], ["C", "F"], ["F", "I"],
      ],
    },
  },
  {
    id: "components",
    label: "components",
    hint: "dvě komponenty",
    graph: {
      nodes: [
        node("A", 100, 90),
        node("B", 270, 60),
        node("C", 190, 220),
        node("D", 470, 90),
        node("E", 660, 90),
        node("F", 560, 220),
      ],
      edges: [["A", "B"], ["A", "C"], ["B", "C"], ["D", "E"], ["D", "F"], ["E", "F"]],
    },
  },
];

/** Limits of the random graph (the sliders in the side panel). */
export const MIN_RANDOM_NODES = 2;
export const MAX_RANDOM_NODES = 16;

/**
 * Positions for n vertices: a grid of 1–3 rows filled row by row
 * (n ≤ 3: one row, n ≤ 8: two rows, otherwise three).
 */
function gridSlots(n: number): { row: number; col: number; x: number; y: number }[] {
  const rows = n <= 3 ? 1 : n <= 8 ? 2 : 3;
  const cols = Math.ceil(n / rows);
  const ys = rows === 1 ? [140] : rows === 2 ? [85, 195] : [50, 140, 230];
  const x = (col: number) => (cols === 1 ? 380 : Math.round(80 + (col * 600) / (cols - 1)));
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    return { row, col, x: x(col), y: ys[row] };
  });
}

/**
 * Edges that may join n grid vertices: neighbours to the right, below and
 * below-right. Edges of this kind never cross each other.
 */
function candidateEdges(n: number): [number, number][] {
  const slots = gridSlots(n);
  const at = (row: number, col: number) => slots.findIndex((s) => s.row === row && s.col === col);
  const edges: [number, number][] = [];
  slots.forEach(({ row, col }, i) => {
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1]]) {
      const j = at(row + dr, col + dc);
      if (j !== -1) edges.push([i, j]);
    }
  });
  return edges;
}

/** The most edges a random graph with n vertices can have (without crossings). */
export function maxRandomEdges(n: number): number {
  return candidateEdges(n).length;
}

/**
 * A random connected graph with `nodeCount` vertices (A, B, …) and `edgeCount`
 * edges, which is kept between nodeCount − 1 (a tree) and maxRandomEdges(nodeCount).
 * Without `edgeCount` it adds about a fifth of the possible extra edges.
 * `random` can be replaced by a seeded generator in tests.
 */
export function randomGraph(nodeCount = 12, edgeCount?: number, random: () => number = Math.random): Graph {
  const n = Math.min(MAX_RANDOM_NODES, Math.max(MIN_RANDOM_NODES, Math.round(nodeCount)));
  const nodes = gridSlots(n).map((slot, i) => node(String.fromCharCode(65 + i), slot.x, slot.y));
  const candidates = candidateEdges(n);
  const max = candidates.length;
  const target = Math.min(max, Math.max(n - 1, edgeCount ?? n - 1 + Math.round((max - (n - 1)) * 0.2)));

  // Shuffle the candidates.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // A random spanning tree (Kruskal with union–find) keeps the graph connected…
  const parent = nodes.map((_, i) => i);
  const root = (i: number): number => (parent[i] === i ? i : root(parent[i]));
  const chosen: [number, number][] = [];
  const rest: [number, number][] = [];
  for (const [a, b] of candidates) {
    if (root(a) !== root(b)) {
      parent[root(a)] = root(b);
      chosen.push([a, b]);
    } else {
      rest.push([a, b]);
    }
  }
  // …and the first of the remaining (shuffled) candidates add cycles up to the wanted count.
  chosen.push(...rest.slice(0, target - chosen.length));

  return { nodes, edges: chosen.map(([a, b]) => [nodes[a].id, nodes[b].id]) };
}
