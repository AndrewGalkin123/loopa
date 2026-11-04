import type { NotePart } from "@/core/types";
import {
  distanceBadges,
  predecessorCycle,
  snapshot,
  sortedEdges,
  treeOf,
  vertex,
  type GraphHighlight,
} from "@/models/graph/snapshot";
import type { GraphEvent, GraphInput, GraphStep } from "@/models/graph/types";

/*
 * Bellman–Ford on a directed graph: negative edges are allowed and a negative
 * cycle reachable from s is reported. Edges in alphabetical order, the run ends
 * early after a pass without a change. Each recorded step says which pseudocode
 * line it belongs to.
 *
 *  1  procedure BellmanFord(G, s)
 *  2    for each vertex v: d[v] ← ∞;  π[v] ← nil
 *  3    d[s] ← 0
 *  4    repeat V - 1 times
 *  5      changed ← false
 *  6      for each edge (u, v, w) do   // in alphabetical order
 *  7        if d[u] + w < d[v] then
 *  8          d[v] ← d[u] + w;  π[v] ← u
 *  9          changed ← true
 * 10      if not changed then
 * 11        return d
 * 12    for each edge (u, v, w) do
 * 13      if d[u] + w < d[v] then
 * 14        return "negative cycle"
 * 15    return d
 */
export function bellmanFordTrace({ graph, start }: GraphInput): GraphStep[] {
  const steps: GraphStep[] = [];
  const edges = sortedEdges(graph);
  const distance: Record<string, number> = Object.fromEntries(graph.nodes.map((n) => [n.id, Infinity]));
  const previous: Record<string, string | null> = Object.fromEntries(graph.nodes.map((n) => [n.id, null]));
  distance[start] = 0;
  let passes = 0;
  let relaxations = 0;

  const reached = () => graph.nodes.map((n) => n.id).filter((id) => distance[id] !== Infinity);

  const record = (line: number, event: GraphEvent, note: NotePart[], extra: GraphHighlight = {}) => {
    steps.push({
      state: snapshot(graph, {
        frontier: reached(),
        treeEdges: treeOf(previous),
        badges: distanceBadges(distance),
        ...extra,
      }),
      event,
      note,
      line,
      counters: { pass: passes, relax: relaxations },
    });
  };

  const shown = (d: number) => (d === Infinity ? "∞" : String(d));

  /** A step that checks the edge: u is the active vertex, v the compared one. */
  const check = (line: number, from: string, to: string, weight: number) => {
    const candidate = distance[from] + weight;
    const text =
      distance[from] === Infinity
        ? `d[${from}] = ∞: skipped`
        : `${distance[from]} + ${weight} = ${candidate} ${candidate < distance[to] ? "<" : "≥"} ${shown(distance[to])}`;
    record(line, { type: "examine", from, to }, [vertex(from, "active"), "→", vertex(to, "compared"), text], {
      active: from,
      compared: to,
      activeEdge: [from, to],
    });
  };

  const finish = (line: number, note: NotePart[]) => {
    record(line, { type: "done", distances: { ...distance }, previous: { ...previous } }, note, { frontier: [], done: reached() });
  };

  record(3, { type: "start", node: start }, ["start", vertex(start, "frontier"), "d=0"]);

  for (let pass = 1; pass <= graph.nodes.length - 1; pass++) {
    passes = pass;
    let changed = false;
    record(5, { type: "pass", number: pass }, [`pass ${pass} of at most ${graph.nodes.length - 1}`]);

    for (const { from, to, weight } of edges) {
      check(7, from, to, weight);
      if (distance[from] + weight < distance[to]) {
        distance[to] = distance[from] + weight;
        previous[to] = from;
        relaxations++;
        changed = true;
        record(8, { type: "relax", from, to, distance: distance[to] }, [vertex(to, "frontier"), `d=${distance[to]}, via ${from}`], {
          activeEdge: [from, to],
        });
      }
    }

    if (!changed) {
      finish(11, [`pass ${pass} changed nothing: done`]);
      return steps;
    }
  }

  // After V − 1 passes the distances are final, unless a negative cycle can still lower them.
  for (const { from, to, weight } of edges) {
    check(13, from, to, weight);
    if (distance[from] + weight < distance[to]) {
      previous[to] = from;
      const cycle = predecessorCycle(previous, to) ?? [];
      record(
        14,
        { type: "done", distances: { ...distance }, previous: { ...previous }, negativeCycle: true },
        ["negative cycle:", cycle.join(" → ")],
        { cycle },
      );
      return steps;
    }
  }

  finish(15, ["no edge improves any more: done"]);
  return steps;
}
