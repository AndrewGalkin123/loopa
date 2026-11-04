import type { NotePart } from "@/core/types";
import { distanceBadges, edgesFrom, predecessorCycle, snapshot, treeOf, vertex, type GraphHighlight } from "@/models/graph/snapshot";
import type { GraphEvent, GraphInput, GraphStep } from "@/models/graph/types";

/*
 * Levit's algorithm in the deque form described at cp-algorithms.com/graph/desopo_pape.html
 * (translated from e-maxx.ru/algo/levit_algorithm). Vertices are in three sets:
 * M0 — distance calculated, though perhaps not finally; M1 — waiting in the deque;
 * M2 — not reached yet. Each recorded step says which pseudocode line it belongs to.
 *
 *  1  procedure Levit(G, s)
 *  2    for each vertex v: d[v] ← ∞;  set[v] ← M2
 *  3    d[s] ← 0;  set[s] ← M1
 *  4    Q ← [s]
 *  5    while Q is not empty do
 *  6      u ← popFront(Q);  set[u] ← M0
 *  7      for each edge (u, v, w) do     // in alphabetical order
 *  8        if d[u] + w < d[v] then
 *  9          d[v] ← d[u] + w;  π[v] ← u
 * 10          if set[v] = M2 then
 * 11            set[v] ← M1;  pushBack(Q, v)
 * 12          else if set[v] = M0 then
 * 13            set[v] ← M1;  pushFront(Q, v)
 *
 * The published algorithm never ends on a negative cycle. So that the player
 * always finishes, a cycle in the predecessor links stops the run: it appears
 * exactly when a negative cycle is reachable. The step limit is only a safety
 * net, the worst case of the algorithm is exponential.
 */
const STEP_LIMIT = 5000;

export function levitTrace({ graph, start }: GraphInput): GraphStep[] {
  const steps: GraphStep[] = [];
  const distance: Record<string, number> = Object.fromEntries(graph.nodes.map((n) => [n.id, Infinity]));
  const previous: Record<string, string | null> = Object.fromEntries(graph.nodes.map((n) => [n.id, null]));
  distance[start] = 0;
  const queue = [start];
  const inM0 = new Set<string>();
  let current: string | undefined;
  let pops = 0;
  let relaxations = 0;

  const record = (line: number, event: GraphEvent, note: NotePart[], extra: GraphHighlight = {}) => {
    steps.push({
      state: snapshot(graph, {
        frontier: queue,
        active: current,
        done: [...inM0],
        treeEdges: treeOf(previous),
        badges: distanceBadges(distance),
        lists: [{ label: "M1 deque", items: queue }],
        ...extra,
      }),
      event,
      note,
      line,
      counters: { pops, relax: relaxations },
    });
  };

  const result = () => ({ type: "done" as const, distances: { ...distance }, previous: { ...previous } });

  record(4, { type: "start", node: start }, ["start", vertex(start, "frontier"), "d=0 → M1"]);

  while (queue.length > 0) {
    const u = queue.shift()!;
    current = u;
    inM0.add(u);
    pops++;
    record(6, { type: "visit", node: u }, ["popped", vertex(u, "active"), "→ M0"]);

    for (const { to: v, weight } of edgesFrom(graph, u)) {
      if (steps.length >= STEP_LIMIT) {
        current = undefined;
        record(0, result(), [`stopped after ${STEP_LIMIT} steps`]);
        return steps;
      }
      const candidate = distance[u] + weight;
      const better = candidate < distance[v];
      const shown = distance[v] === Infinity ? "∞" : distance[v];
      record(
        8,
        { type: "examine", from: u, to: v },
        ["checking", vertex(v, "compared"), `${distance[u]} + ${weight} = ${candidate} ${better ? "<" : "≥"} ${shown}`],
        { compared: v, activeEdge: [u, v] },
      );
      if (!better) continue;

      const wasNew = distance[v] === Infinity;
      const wasDone = inM0.has(v);
      distance[v] = candidate;
      previous[v] = u;
      relaxations++;

      const cycle = predecessorCycle(previous, v);
      if (cycle) {
        current = undefined;
        record(0, { ...result(), negativeCycle: true }, ["negative cycle:", cycle.join(" → ")], { cycle });
        return steps;
      }

      if (wasNew) {
        queue.push(v);
        record(11, { type: "relax", from: u, to: v, distance: candidate }, [vertex(v, "frontier"), `d=${candidate}: M2 → end of M1`], {
          activeEdge: [u, v],
        });
      } else if (wasDone) {
        inM0.delete(v);
        queue.unshift(v);
        record(13, { type: "relax", from: u, to: v, distance: candidate }, [vertex(v, "frontier"), `d=${candidate}: M0 → front of M1`], {
          activeEdge: [u, v],
        });
      } else {
        record(9, { type: "relax", from: u, to: v, distance: candidate }, [vertex(v, "frontier"), `d=${candidate}: already in M1`], {
          activeEdge: [u, v],
        });
      }
    }
    current = undefined;
  }

  const unreached = graph.nodes.map((n) => n.id).filter((id) => distance[id] === Infinity);
  record(0, result(), unreached.length ? ["deque empty — not reached:", unreached.join(", ")] : ["deque empty"]);
  return steps;
}
