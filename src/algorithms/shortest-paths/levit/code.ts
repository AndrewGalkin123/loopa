import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of Levit's algorithm, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure Levit(G, s)
  for each vertex v: d[v] ← ∞;  set[v] ← M2
  d[s] ← 0;  set[s] ← M1
  Q ← [s]
  while Q is not empty do
    u ← popFront(Q);  set[u] ← M0
    for each edge (u, v, w) do     // in alphabetical order
      if d[u] + w < d[v] then
        d[v] ← d[u] + w;  π[v] ← u
        if set[v] = M2 then
          set[v] ← M1;  pushBack(Q, v)
        else if set[v] = M0 then
          set[v] ← M1;  pushFront(Q, v)
`,
  "pseudo",
);

const JS = `
// graph[u] = [[v, weight], …]. A negative cycle would make it run forever.
function levit(graph, start) {
  const dist = {};
  const set = {};   // 2 = M2 (not reached), 1 = M1 (in the deque), 0 = M0 (calculated)
  for (const v in graph) {
    dist[v] = Infinity;
    set[v] = 2;
  }
  dist[start] = 0;
  set[start] = 1;
  const deque = [start];
  while (deque.length > 0) {
    const u = deque.shift();
    set[u] = 0;
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        if (set[v] === 2) deque.push(v);
        else if (set[v] === 0) deque.unshift(v);
        set[v] = 1;
      }
    }
  }
  return dist;
}
`;

const PYTHON = `
from collections import deque

# graph[u] = [(v, weight), …]. A negative cycle would make it run forever.
def levit(graph, start):
    dist = {v: float("inf") for v in graph}
    state = {v: 2 for v in graph}   # 2 = M2, 1 = M1, 0 = M0
    dist[start] = 0
    state[start] = 1
    queue = deque([start])
    while queue:
        u = queue.popleft()
        state[u] = 0
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if state[v] == 2:
                    queue.append(v)
                elif state[v] == 0:
                    queue.appendleft(v)
                state[v] = 1
    return dist
`;

const JAVA = `
record Edge(int to, int weight) {}

// A negative cycle would make it run forever.
static long[] levit(List<List<Edge>> graph, int start) {
  int n = graph.size();
  long[] dist = new long[n];
  int[] set = new int[n];   // 2 = M2, 1 = M1, 0 = M0
  Arrays.fill(dist, Long.MAX_VALUE);
  Arrays.fill(set, 2);
  dist[start] = 0;
  set[start] = 1;
  Deque<Integer> deque = new ArrayDeque<>(List.of(start));
  while (!deque.isEmpty()) {
    int u = deque.pollFirst();
    set[u] = 0;
    for (Edge e : graph.get(u)) {
      if (dist[u] + e.weight() < dist[e.to()]) {
        dist[e.to()] = dist[u] + e.weight();
        if (set[e.to()] == 2) deque.addLast(e.to());
        else if (set[e.to()] == 0) deque.addFirst(e.to());
        set[e.to()] = 1;
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
