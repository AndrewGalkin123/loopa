import type { NotePart } from "@/core/types";
import { neighbours, snapshot, vertex, type GraphHighlight } from "@/models/graph/snapshot";
import type { GraphEvent, GraphInput, GraphStep } from "@/models/graph/types";

/*
 * Breadth-first search with the conventions of the research tests
 * (docs/research/02-testy-pre-post.md, answer_keys.py): an undirected graph,
 * neighbours in alphabetical order, a vertex is marked visited when it is put
 * into the queue, d[v] = number of edges from s. Each recorded step says which
 * pseudocode line it belongs to.
 *
 *  1  procedure BFS(G, s)
 *  2    for each vertex v: visited[v] ← false;  d[v] ← ∞
 *  3    visited[s] ← true;  d[s] ← 0
 *  4    Q ← [s]
 *  5    while Q is not empty do
 *  6      u ← dequeue(Q)
 *  7      for each neighbour v of u do   // in alphabetical order
 *  8        if not visited[v] then
 *  9          visited[v] ← true
 * 10          d[v] ← d[u] + 1
 * 11          enqueue(Q, v)
 */
export function bfsTrace({ graph, start }: GraphInput): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set([start]);
  const distance: Record<string, number> = { [start]: 0 };
  const queue = [start];
  const order: string[] = [];
  const done: string[] = [];
  const tree: [string, string][] = [];
  let current: string | undefined;
  let nodes = 0;
  let edges = 0;

  // Saves a snapshot of the current moment.
  const record = (line: number, event: GraphEvent, note: NotePart[], extra: GraphHighlight = {}) => {
    steps.push({
      state: snapshot(graph, {
        frontier: queue,
        active: current,
        done,
        treeEdges: tree,
        badges: Object.fromEntries(Object.entries(distance).map(([v, d]) => [v, `d=${d}`])),
        lists: [
          { label: "queue", items: queue },
          { label: "order", items: order },
        ],
        ...extra,
      }),
      event,
      note,
      line,
      counters: { nodes, edges },
    });
  };

  record(4, { type: "start", node: start }, ["start", vertex(start, "frontier"), "d=0 → queue"]);

  while (queue.length > 0) {
    // The previous vertex is fully processed.
    if (current) done.push(current);
    current = queue.shift()!;
    order.push(current);
    nodes++;
    record(6, { type: "visit", node: current }, ["dequeued", vertex(current, "active")]);

    for (const v of neighbours(graph, current)) {
      edges++;
      const seen = visited.has(v);
      record(8, { type: "examine", from: current, to: v }, ["checking", vertex(v, "compared"), seen ? "— already visited" : "— new"], {
        compared: v,
        activeEdge: [current, v],
      });
      if (!seen) {
        visited.add(v);
        distance[v] = distance[current] + 1;
        queue.push(v);
        tree.push([current, v]);
        record(11, { type: "discover", node: v, from: current }, [vertex(v, "frontier"), `d=${distance[v]} → queue`], {
          activeEdge: [current, v],
        });
      }
    }
  }

  if (current) done.push(current);
  current = undefined;
  const unreached = graph.nodes.map((n) => n.id).filter((id) => !visited.has(id));
  record(0, { type: "done" }, unreached.length ? ["queue empty — not reached:", unreached.join(", ")] : ["queue empty"]);
  return steps;
}

