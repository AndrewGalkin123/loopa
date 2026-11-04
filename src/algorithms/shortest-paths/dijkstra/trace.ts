import type { NotePart } from "@/core/types";
import { distanceBadges, edgesFrom, snapshot, treeOf, vertex, type GraphHighlight } from "@/models/graph/snapshot";
import type { GraphEvent, GraphInput, GraphStep } from "@/models/graph/types";

/*
 * Dijkstra's algorithm with the conventions of the research tests
 * (docs/research/02-testy-pre-post.md, answer_keys.py): non-negative weights,
 * neighbours in alphabetical order, of two vertices with the same d the one
 * earlier in the alphabet goes first. Each recorded step says which pseudocode
 * line it belongs to.
 *
 *  1  procedure Dijkstra(G, s)
 *  2    for each vertex v: d[v] ← ∞;  π[v] ← nil
 *  3    d[s] ← 0
 *  4    S ← ∅
 *  5    Q ← priority queue of all vertices by d
 *  6    while Q is not empty do
 *  7      u ← extractMin(Q)
 *  8      S ← S ∪ {u}
 *  9      for each neighbour v of u do   // in alphabetical order
 * 10        if d[u] + w(u, v) < d[v] then
 * 11          d[v] ← d[u] + w(u, v)
 * 12          π[v] ← u
 *
 * Vertices with d = ∞ are not shown in Q: once only they are left, nothing can
 * change any more, so the run ends there.
 */
export function dijkstraTrace({ graph, start }: GraphInput): GraphStep[] {
  const steps: GraphStep[] = [];
  const distance: Record<string, number> = Object.fromEntries(graph.nodes.map((n) => [n.id, Infinity]));
  const previous: Record<string, string | null> = Object.fromEntries(graph.nodes.map((n) => [n.id, null]));
  distance[start] = 0;
  const closed: string[] = [];
  let current: string | undefined;
  let relaxations = 0;

  /** Reached vertices that are not closed yet, the smallest d first. */
  const queue = () =>
    graph.nodes
      .map((n) => n.id)
      .filter((id) => distance[id] !== Infinity && !closed.includes(id))
      .sort((a, b) => distance[a] - distance[b] || a.localeCompare(b));

  const record = (line: number, event: GraphEvent, note: NotePart[], extra: GraphHighlight = {}) => {
    const q = queue();
    steps.push({
      state: snapshot(graph, {
        frontier: q,
        active: current,
        done: closed,
        treeEdges: treeOf(previous),
        badges: distanceBadges(distance),
        lists: [
          { label: "queue", items: q, texts: q.map((id) => `${id}:${distance[id]}`) },
          { label: "closed", items: [...closed] },
        ],
        ...extra,
      }),
      event,
      note,
      line,
      counters: { closed: closed.length, relax: relaxations },
    });
  };

  record(5, { type: "start", node: start }, ["start", vertex(start, "frontier"), "d=0"]);

  while (queue().length > 0) {
    const u = queue()[0];
    current = u;
    closed.push(u);
    record(7, { type: "visit", node: u }, ["closed", vertex(u, "active"), `d=${distance[u]}: the smallest in the queue`]);

    for (const { to: v, weight } of edgesFrom(graph, u)) {
      const candidate = distance[u] + weight;
      const shown = distance[v] === Infinity ? "∞" : distance[v];
      const better = candidate < distance[v];
      record(
        10,
        { type: "examine", from: u, to: v },
        ["checking", vertex(v, "compared"), `${distance[u]} + ${weight} = ${candidate} ${better ? "<" : "≥"} ${shown}`],
        { compared: v, activeEdge: [u, v] },
      );
      if (better) {
        distance[v] = candidate;
        previous[v] = u;
        relaxations++;
        record(11, { type: "relax", from: u, to: v, distance: candidate }, [vertex(v, "frontier"), `d=${candidate}, via ${u}`], {
          activeEdge: [u, v],
        });
      }
    }
    current = undefined;
  }

  const unreached = graph.nodes.map((n) => n.id).filter((id) => distance[id] === Infinity);
  record(
    0,
    { type: "done", distances: { ...distance }, previous: { ...previous } },
    unreached.length ? ["queue empty — not reached:", unreached.join(", ")] : ["queue empty"],
  );
  return steps;
}
