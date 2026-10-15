import type { ReactNode } from "react";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/**
 * One step of an algorithm working on an array: what just happened
 * and how the array looks after it. The player only replays these steps,
 * it knows nothing about the algorithm itself.
 */
export interface ArrayStep {
  /**
   * What happened:
   * start / done — before the first and after the last step;
   * pass — a new pass over the array begins (Bubble Sort);
   * partition — partitioning of the part `range` around `pivot` begins (Quick Sort);
   * compare, swap — the elements in `indices` are compared / swapped;
   * settle — the element in `indices` reached its final place.
   */
  kind: "start" | "pass" | "partition" | "compare" | "swap" | "settle" | "done";
  /** The array after this step. */
  array: number[];
  /** Indices the step works with: the compared or swapped elements, or the element that just settled. */
  indices: number[];
  /** Indices whose value is already in its final place. */
  sorted: number[];
  /** Index of the pivot while a part is being partitioned (Quick Sort). */
  pivot?: number;
  /** The part of the array the algorithm works on now, [from, to] inclusive; the rest is dimmed. */
  range?: [number, number];
  /** Pseudocode line (1-based) executed by this step; 0 = no line. */
  line: number;
  /** Number of the current pass over the array (0 before the first one). */
  pass: number;
  /** Comparisons and swaps made so far. */
  cmp: number;
  swp: number;
}

/** What the player needs from an algorithm (runs in the browser). */
export interface AlgorithmTracer {
  /** Runs the algorithm on the input and records every step. */
  trace: (input: number[]) => ArrayStep[];
  /**
   * Pseudocode lines that have no step of their own, mapped to a line that has one.
   * Clicking such a line jumps to the step of the mapped line.
   */
  lineAliases: Record<number, number>;
}

/** Colour states of the bars, as listed in the legend next to the player. */
export type BarState = "default" | "active" | "compared" | "pivot" | "sorted" | "dimmed";

/** Kinds of generated input arrays (the "array" button of the player). */
export type DatasetKind = "random" | "nearly" | "sorted" | "reversed";

/** Texts and code shown on the algorithm page (rendered on the server). */
export interface AlgorithmContent {
  /** Part of the URL: /algorithms/<slug> */
  slug: string;
  name: string;
  /** Category shown in the breadcrumbs, e.g. "sorting". */
  group: string;
  badge: AlgorithmCardData["badge"];
  complexity: string;
  level: string;
  readMinutes: number;
  lede: ReactNode;
  /** Array the player starts with. */
  initialInput: number[];
  /** Bar states this algorithm uses (legend next to the player). */
  legend: BarState[];
  /** What each kind of input means for this algorithm, e.g. sorted → "nejlepší případ". */
  datasetHints?: Partial<Record<DatasetKind, string>>;
  compareWith: { name: string; complexity: string; href: string }[];
  /** Body of the "01 / Popis" section. */
  description: ReactNode;
  pseudocode: ReactNode[];
  implementations: { id: string; label: string; lines: ReactNode[] }[];
  complexityCases: {
    label: string;
    sub: string;
    bigO: string;
    note: ReactNode;
    tone?: "good" | "bad";
  }[];
  complexityChart: ReactNode;
  related: AlgorithmCardData[];
  /** The last "related" card: a big link to the next algorithm to study. */
  next: { name: string; group: string; badge: AlgorithmCardData["badge"]; complexity: string; level: string; href: string };
}
