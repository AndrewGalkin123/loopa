import { Crosshair } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { ComplexityChart, GROWTH } from "@/components/ComplexityChart";
import { IMPLEMENTATIONS, PSEUDOCODE } from "./code";

/* The Bubble Sort page in English (translated from content.cs.tsx). */

const description = (
  <>
    <div className="section-marker">01 / Description</div>
    <h2>
      How Bubble Sort <em>works</em>
    </h2>
    <p>
      <span className="drop">Imagine</span> sorting a deck of cards. Bubble Sort works like the slowest person you can
      think of — it always compares just two <em>neighbouring</em> cards and, if they are in the wrong order, swaps
      them. Then it moves one place on and does the same.
    </p>
    <p>
      The algorithm goes through the array again and again until it makes a whole pass without a single swap. Each
      time, the largest element “bubbles” all the way up like an air bubble — hence the name.
    </p>

    <div className="inline-viz-row">
      <p style={{ margin: 0 }}>
        Follow one value during the first pass. Whenever it is larger than its right neighbour, the two swap — and it
        keeps travelling until it meets an even larger neighbour or the end of the array.
      </p>
      <div className="inline-viz" aria-hidden="true">
        <div className="head">
          <span>bubble&nbsp;up</span>
          <span className="accent">pass 1</span>
        </div>
        <div className="bars">
          <div className="b" style={{ height: "30%" }} />
          <div className="b" style={{ height: "48%" }} />
          <div className="b up" style={{ height: "88%" }} />
          <div className="b" style={{ height: "62%" }} />
          <div className="b" style={{ height: "40%" }} />
        </div>
        <div className="arrow">[2] → swap → [3] →</div>
      </div>
    </div>

    <h2>
      When to <em>use it</em>
    </h2>
    <p>
      Never in production. Really. For an array of a thousand elements it does on the order of a million operations
      where Quicksort gets by with ten thousand. There is one exception where it makes sense, though:{" "}
      <strong>almost sorted data</strong> with the early-exit optimisation, where it finishes in linear time.
    </p>

    <div className="callout">
      <div className="q">Keep it in production? Never. So why teach it?</div>
      <p>
        Bubble Sort is taught because it is the <em>ideal starting point</em> for understanding how sorting works at all
        — the invariant “after k passes, the k largest elements are in place” can be seen here with your own eyes. Once
        you understand it, Quicksort and Merge Sort make much more sense.
      </p>
    </div>

    <p className="pull">“The largest element always floats up. The question is not whether, but after how many comparisons.”</p>

    <p>
      With every further pass the upper bound moves one place down — the last position is sorted for good, so there is
      no need to check it again. That is the growing <span style={{ color: "var(--viz-sorted)" }}>cyan</span> area on
      the right that you see above.
    </p>
  </>
);

export const bubbleSortContentEn: AlgorithmContent = {
  readMinutes: 5,
  lede: (
    <>
      The simplest comparison-based sorting algorithm. Slow in practice, but <em>perfect</em> for understanding how
      sorting works at all.
    </>
  ),
  compareWith: [
    { name: "Quick Sort", complexity: "O(n log n)", href: "/compare?a=bubble-sort&b=quick-sort" },
    { name: "Merge Sort", complexity: "O(n log n)", href: "/compare?a=bubble-sort&b=merge-sort" },
    { name: "Selection Sort", complexity: "O(n²)", href: "/compare?a=bubble-sort&b=selection-sort" },
    { name: "Insertion Sort", complexity: "O(n²)", href: "/compare?a=bubble-sort&b=insertion-sort" },
  ],
  description,
  pseudocode: PSEUDOCODE,
  implementations: IMPLEMENTATIONS,
  complexityCases: [
    {
      label: "Best case",
      sub: "best case",
      bigO: "O(n)",
      note: (
        <>
          When the array is <em>already sorted</em> — a single pass without a swap and the algorithm stops.
        </>
      ),
      tone: "good",
    },
    {
      label: "Average case",
      sub: "average case",
      bigO: "O(n²)",
      note: <>Random order. The number of comparisons grows with the square of the input size.</>,
    },
    {
      label: "Worst case",
      sub: "worst case",
      bigO: "O(n²)",
      note: (
        <>
          An array sorted in <em>descending</em> order — every element has to bubble through the whole array.
        </>
      ),
      tone: "bad",
    },
    {
      label: "Space",
      sub: "memory",
      bigO: "O(1)",
      note: (
        <>
          Sorts <em>in place</em>, the swaps happen right in the array. No helper structure.
        </>
      ),
      tone: "good",
    },
  ],
  complexityChart: (
    <ComplexityChart
      title="array size&nbsp;→&nbsp;time"
      axis="input size n · without constants"
      curves={[
        { label: "bubble · O(n²)", grows: GROWTH.n2 },
        { label: "quicksort · O(n log n)", grows: GROWTH.nLogN, style: "dash" },
      ]}
    />
  ),
  related: ["quick-sort", "merge-sort"],
  next: {
    name: "Selection Sort",
    group: "sorting",
    badge: { variant: "sorting", icon: Crosshair, label: "select" },
    complexity: "O(n²)",
    level: "beginner",
    href: "/algorithms/selection-sort",
  },
};
