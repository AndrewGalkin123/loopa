import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of DFS, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure DFS(G, s)
  for each vertex v: visited[v] ← false
  visit(s)

procedure visit(u)
  visited[u] ← true
  for each neighbour v of u do   // in alphabetical order
    if not visited[v] then
      visit(v)
  return                         // u is finished
`,
  "pseudo",
);

const JS = `
function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  function visit(u) {
    visited.add(u);
    order.push(u);
    for (const v of graph[u]) {   // neighbours in alphabetical order
      if (!visited.has(v)) visit(v);
    }
  }
  visit(start);
  return order;
}
`;

const PYTHON = `
def dfs(graph, start):
    visited = set()
    order = []

    def visit(u):
        visited.add(u)
        order.append(u)
        for v in graph[u]:   # neighbours in alphabetical order
            if v not in visited:
                visit(v)

    visit(start)
    return order
`;

const JAVA = `
static void dfs(Map<String, List<String>> graph, String u,
                Set<String> visited, List<String> order) {
  visited.add(u);
  order.add(u);
  for (String v : graph.get(u)) {   // neighbours in alphabetical order
    if (!visited.contains(v)) {
      dfs(graph, v, visited, order);
    }
  }
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
