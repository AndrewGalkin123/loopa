import { describe, expect, test } from "vitest";
import { testWeightedGraphs } from "@/algorithms/testUtils";
import { DIRECTED_PRESETS } from "@/models/graph/presets";
import { levit } from "./definition";
import { levitTrace } from "./trace";

const preset = (id: string) => DIRECTED_PRESETS.find((p) => p.id === id)!.graph;

/** The deque form from cp-algorithms: the order in which vertices are popped. */
function reference(graph: (typeof DIRECTED_PRESETS)[number]["graph"], start: string) {
  const arcs = (u: string) =>
    graph.edges
      .filter(([a]) => a === u)
      .map(([, to, w]) => ({ to, w: w! }))
      .sort((x, y) => x.to.localeCompare(y.to));
  const d: Record<string, number> = Object.fromEntries(graph.nodes.map((n) => [n.id, Infinity]));
  const set: Record<string, number> = Object.fromEntries(graph.nodes.map((n) => [n.id, 2]));
  d[start] = 0;
  set[start] = 1;
  const q = [start];
  const pops: string[] = [];
  while (q.length > 0) {
    const u = q.shift()!;
    set[u] = 0;
    pops.push(u);
    for (const { to, w } of arcs(u)) {
      if (d[to] > d[u] + w) {
        d[to] = d[u] + w;
        if (set[to] === 2) {
          set[to] = 1;
          q.push(to);
        } else if (set[to] === 0) {
          set[to] = 1;
          q.unshift(to);
        }
      }
    }
  }
  return pops;
}

describe("Levit", () => {
  test("pops vertices in the same order as the published deque algorithm", () => {
    for (const graph of testWeightedGraphs(levit.weighted!, 80)) {
      if (graph.edges.length === 0 || graph === preset("neg-cycle")) continue;
      const pops = levitTrace({ graph, start: "A" }).flatMap((s) => (s.event.type === "visit" ? [s.event.node] : []));
      expect(pops).toEqual(reference(graph, "A"));
    }
  });

  test("a vertex improved after being processed goes to the front of the deque", () => {
    const steps = levitTrace({ graph: preset("negative"), start: "A" });
    const back = steps.find((s) => s.line === 13)!;
    expect(back.event).toMatchObject({ type: "relax", from: "C", to: "B", distance: 2 });
    expect(back.state.lists[0].items[0]).toBe("B");
  });

  test("a new vertex goes to the end of the deque", () => {
    const steps = levitTrace({ graph: preset("positive"), start: "A" });
    const added = steps.find((s) => s.line === 11 && s.event.type === "relax" && s.event.to === "C")!;
    expect(added.state.lists[0].items).toEqual(["B", "C"]);
  });

  test("a negative cycle stops the run instead of running forever", () => {
    const last = levitTrace({ graph: preset("neg-cycle"), start: "A" }).at(-1)!;
    expect(last.event).toMatchObject({ type: "done", negativeCycle: true });
  });
});
