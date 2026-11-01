import type { NotePart } from "@/core/types";
import { neighbours, snapshot, vertex, type GraphHighlight } from "@/models/graph/snapshot";
import type { GraphEvent, GraphInput, GraphStep } from "@/models/graph/types";

/*
 * Depth-first search, the classic recursive version: an undirected graph,
 * neighbours in alphabetical order (as in the BFS of the research tests).
 * The "stack" shown under the picture is the stack of recursive calls.
 * Each recorded step says which pseudocode line it belongs to.
 *
 *  1  procedure DFS(G, s)
 *  2    for each vertex v: visited[v] ← false
 *  3    visit(s)
 *  4
 *  5  procedure visit(u)
 *  6    visited[u] ← true
 *  7    for each neighbour v of u do   // in alphabetical order
 *  8      if not visited[v] then
 *  9        visit(v)
 * 10    return                         // u is finished
 */
export function dfsTrace({ graph, start }: GraphInput): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const stack: string[] = [];
  const order: string[] = [];
  const done: string[] = [];
  const tree: [string, string][] = [];
  let nodes = 0;
  let edges = 0;

  // Saves a snapshot of the current moment. The top of the stack is the active vertex.
  const record = (line: number, event: GraphEvent, note: NotePart[], extra: GraphHighlight = {}) => {
    steps.push({
      state: snapshot(graph, {
        active: stack[stack.length - 1],
        frontier: stack.slice(0, -1),
        done,
        treeEdges: tree,
        lists: [
          { label: "stack", items: stack },
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

  function visit(u: string, from?: string) {
    visited.add(u);
    stack.push(u);
    order.push(u);
    nodes++;
    if (from) tree.push([from, u]);
    record(6, { type: "visit", node: u }, from ? ["visiting", vertex(u, "active"), "from", from] : ["visiting", vertex(u, "active")]);

    for (const v of neighbours(graph, u)) {
      edges++;
      const seen = visited.has(v);
      record(8, { type: "examine", from: u, to: v }, ["checking", vertex(v, "compared"), seen ? "— already visited" : "— new, go deeper"], {
        compared: v,
        activeEdge: [u, v],
      });
      if (!seen) visit(v, u);
    }

    // Everything reachable from u is visited: back to the vertex that called visit(u).
    stack.pop();
    done.push(u);
    record(10, { type: "finish", node: u }, [vertex(u, "done"), "finished"]);
  }

  record(3, { type: "start", node: start }, ["start at", start]);
  visit(start);

  const unreached = graph.nodes.map((n) => n.id).filter((id) => !visited.has(id));
  record(0, { type: "done" }, unreached.length ? ["stack empty — not reached:", unreached.join(", ")] : ["stack empty"]);
  return steps;
}
