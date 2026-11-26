import type { LandingTexts } from "./landing";

/* The landing page in English (translated from landing.cs.tsx). */
export const LANDING_EN: LandingTexts = {
  hero: {
    title: (
      <>
        Algorithms,
        <br />
        explained <em>visually</em>.
      </>
    ),
    lede: <>Interactive visualizations of mathematical and algorithmic procedures. For students who want to really understand.</>,
    start: "Start now",
    catalog: "Browse the catalog",
  },
  explore: {
    title: (
      <>
        Understand in depth <em>how they work</em>.
      </>
    ),
    text: "Six classics to begin with. Well-trodden lecture theory, turned into steps you can see and control.",
    all: "All algorithms",
  },
  featured: [
    "A simple sorting algorithm. Ideal for understanding the principles of comparing and swapping neighbouring elements.",
    "Divide and conquer. It picks a pivot and recursively sorts the two halves. A master in practice, touchy in the worst case.",
    "Searching in a sorted array. Every step throws away half of the space. Logarithmic, elegant.",
    "Walks through a graph layer by layer, like a ripple on water. Finds the shortest path in an unweighted graph.",
    "Finds the shortest paths from one source in a weighted graph with non-negative edges.",
    "A classic problem of dynamic programming. Maximise the value within a limited capacity.",
  ],
  compare: {
    title: (
      <>
        Two algorithms. One input. <em>One truth.</em>
      </>
    ),
    text: (
      <>
        Run Bubble Sort and Quicksort on the identical array and watch them drift apart — step by step, comparison by
        comparison. No theory. Concrete numbers.
      </>
    ),
    open: "Open the comparison",
    openFull: "Open the full comparison",
  },
  ai: {
    title: (
      <>
        Ask about <em>anything</em>.
      </>
    ),
    text: (
      <>
        The built-in assistant explains any algorithm based on verified material. No hallucinations — only checked
        knowledge.
      </>
    ),
    features: [
      <>
        <b>Verified corpus</b> — the sources are textbooks, not the web
      </>,
      <>
        <b>Step-accurate</b> — it knows where the player is right now
      </>,
      <>
        <b>Citations on a click</b> — every claim with a reference
      </>,
    ],
    tryIt: "Try it",
    question1: "Why is bubble sort called “bubble”?",
    answer1: (
      <>
        Larger elements gradually “bubble” towards the end of the array — in every pass the largest remaining value
        settles into its final place, like an air bubble rising to the surface.
      </>
    ),
    question2: "And the worst case?",
    answer2: (
      <>
        O(n²) — when the input is sorted in descending order. Then it makes <span className="mono-inline">n(n−1)/2</span>{" "}
        comparisons and the same number of swaps.
      </>
    ),
    placeholder: <>Ask anything about this algorithm…</>,
  },
  forYou: {
    title: (
      <>
        It is not <em>Brilliant.</em> It is not <em>visualgo.</em>
      </>
    ),
    text: (
      <>
        We build for people who want to really understand algorithms — not collect badges and click through fifty
        quizzes before they reach the first idea.
      </>
    ),
    crossed: "Game. Missions. Badges.",
    claim: "Depth over breadth. Understanding over progress.",
  },
  features: [
    {
      title: "Deep",
      em: "explanations",
      text: "Not three lines and an animation. The whole theory — invariants, edge cases, proof of correctness, trade-offs in practice.",
    },
    {
      title: "Real",
      em: "comparison",
      text: "Put two algorithms against each other on the same data and see the difference with your own eyes. No complexity tables in a book.",
    },
    {
      title: "No",
      em: "gamification",
      text: "No missions, no streaks, no virtual currency. Just knowledge, visualization and time to think.",
    },
  ],
  final: {
    title: (
      <>
        Ready to understand <em>algorithms?</em>
      </>
    ),
    text: <>Start with Bubble Sort. Or dive straight into Dijkstra. No registration, no commitment.</>,
    start: "Start",
    catalog: "Browse the catalog",
  },
};
