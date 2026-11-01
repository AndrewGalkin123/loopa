import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of BFS, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure BFS(G, s)
  for each vertex v: visited[v] ← false;  d[v] ← ∞
  visited[s] ← true;  d[s] ← 0
  Q ← [s]
  while Q is not empty do
    u ← dequeue(Q)
    for each neighbour v of u do   // in alphabetical order
      if not visited[v] then
        visited[v] ← true
        d[v] ← d[u] + 1
        enqueue(Q, v)
`,
  "pseudo",
);

const JS = `
function bfs(graph, start) {
  const visited = new Set([start]);
  const dist = { [start]: 0 };
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const v of graph[u]) {   // neighbours in alphabetical order
      if (!visited.has(v)) {
        visited.add(v);
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return { order, dist };
}
`;

const PYTHON = `
from collections import deque

def bfs(graph, start):
    visited = {start}
    dist = {start: 0}
    queue = deque([start])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:   # neighbours in alphabetical order
            if v not in visited:
                visited.add(v)
                dist[v] = dist[u] + 1
                queue.append(v)
    return order, dist
`;

const JAVA = `
static List<String> bfs(Map<String, List<String>> graph, String start) {
  Set<String> visited = new HashSet<>(List.of(start));
  Map<String, Integer> dist = new HashMap<>(Map.of(start, 0));
  Deque<String> queue = new ArrayDeque<>(List.of(start));
  List<String> order = new ArrayList<>();
  while (!queue.isEmpty()) {
    String u = queue.poll();
    order.add(u);
    for (String v : graph.get(u)) {   // neighbours in alphabetical order
      if (!visited.contains(v)) {
        visited.add(v);
        dist.put(v, dist.get(u) + 1);
        queue.add(v);
      }
    }
  }
  return order;
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
