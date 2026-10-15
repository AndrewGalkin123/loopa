import type { ReactNode } from "react";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/**
 * One step of an algorithm working on an array: what just happened
 * and how the array looks after it. The player only replays these steps,
 * it knows nothing about the algorithm itself.
 */
export interface ArrayStep {
  kind: "start" | "pass" | "compare" | "swap" | "pass-end" | "done";
  /** The array after this step. */
  array: number[];
  /** Indices the step works with: the compared or swapped pair, or the element that just settled. */
  indices: number[];
  /** Indices whose value is already in its final place. */
  sorted: number[];
  /** Pseudocode line (1-based) executed by this step. */
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
