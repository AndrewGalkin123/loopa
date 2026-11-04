import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of Dijkstra's algorithm, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure Dijkstra(G, s)
  for each vertex v: d[v] ← ∞;  π[v] ← nil
  d[s] ← 0
  S ← ∅
  Q ← priority queue of all vertices by d
  while Q is not empty do
    u ← extractMin(Q)
    S ← S ∪ {u}
    for each neighbour v of u do   // in alphabetical order
      if d[u] + w(u, v) < d[v] then
        d[v] ← d[u] + w(u, v)
        π[v] ← u
`,
  "pseudo",
);

const JS = `
// graph[u] = [[v, weight], …]. A simple array search for the minimum: O(V²).
function dijkstra(graph, start) {
  const dist = {};
  const prev = {};
  for (const v in graph) {
    dist[v] = Infinity;
    prev[v] = null;
  }
  dist[start] = 0;
  const closed = new Set();
  while (true) {
    let u = null;
    for (const v in graph) {
      if (!closed.has(v) && dist[v] < Infinity && (u === null || dist[v] < dist[u])) u = v;
    }
    if (u === null) return { dist, prev };
    closed.add(u);
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
}
`;

const PYTHON = `
import heapq

# graph[u] = [(v, weight), …]
def dijkstra(graph, start):
    dist = {v: float("inf") for v in graph}
    prev = {v: None for v in graph}
    dist[start] = 0
    heap = [(0, start)]
    closed = set()
    while heap:
        d, u = heapq.heappop(heap)
        if u in closed:
            continue   # an outdated entry
        closed.add(u)
        for v, w in graph[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                prev[v] = u
                heapq.heappush(heap, (dist[v], v))
    return dist, prev
`;

const JAVA = `
record Edge(int to, int weight) {}

static int[] dijkstra(List<List<Edge>> graph, int start) {
  int[] dist = new int[graph.size()];
  Arrays.fill(dist, Integer.MAX_VALUE);
  dist[start] = 0;
  // Entries {distance, vertex}, the smallest distance first.
  PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(e -> e[0]));
  heap.add(new int[] {0, start});
  while (!heap.isEmpty()) {
    int[] entry = heap.poll();
    int u = entry[1];
    if (entry[0] > dist[u]) continue;   // an outdated entry
    for (Edge e : graph.get(u)) {
      if (dist[u] + e.weight() < dist[e.to()]) {
        dist[e.to()] = dist[u] + e.weight();
        heap.add(new int[] {dist[e.to()], e.to()});
      }
    }
  }
  return dist;
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
