import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of Bellman–Ford, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure BellmanFord(G, s)
  for each vertex v: d[v] ← ∞;  π[v] ← nil
  d[s] ← 0
  repeat V - 1 times
    changed ← false
    for each edge (u, v, w) do   // in alphabetical order
      if d[u] + w < d[v] then
        d[v] ← d[u] + w;  π[v] ← u
        changed ← true
    if not changed then
      return d
  for each edge (u, v, w) do
    if d[u] + w < d[v] then
      return "negative cycle"
  return d
`,
  "pseudo",
);

const JS = `
// edges = [[u, v, weight], …]
function bellmanFord(vertices, edges, start) {
  const dist = {};
  for (const v of vertices) dist[v] = Infinity;
  dist[start] = 0;
  for (let pass = 1; pass < vertices.length; pass++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) return dist;
  }
  for (const [u, v, w] of edges) {
    if (dist[u] + w < dist[v]) throw new Error("negative cycle");
  }
  return dist;
}
`;

const PYTHON = `
# edges = [(u, v, weight), …]
def bellman_ford(vertices, edges, start):
    dist = {v: float("inf") for v in vertices}
    dist[start] = 0
    for _ in range(len(vertices) - 1):
        changed = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            return dist
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            raise ValueError("negative cycle")
    return dist
`;

const JAVA = `
record Edge(int from, int to, int weight) {}

static long[] bellmanFord(int n, List<Edge> edges, int start) {
  long[] dist = new long[n];
  Arrays.fill(dist, Long.MAX_VALUE);
  dist[start] = 0;
  for (int pass = 1; pass < n; pass++) {
    boolean changed = false;
    for (Edge e : edges) {
      if (dist[e.from()] != Long.MAX_VALUE && dist[e.from()] + e.weight() < dist[e.to()]) {
        dist[e.to()] = dist[e.from()] + e.weight();
        changed = true;
      }
    }
    if (!changed) return dist;
  }
  for (Edge e : edges) {
    if (dist[e.from()] != Long.MAX_VALUE && dist[e.from()] + e.weight() < dist[e.to()]) {
      throw new IllegalStateException("negative cycle");
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
