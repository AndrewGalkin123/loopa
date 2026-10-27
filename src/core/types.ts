import type { ComponentType } from "react";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/*
 * The contract between the three layers:
 *
 *   core        — knows only these types; plays steps (src/core/player)
 *   models      — how the data looks: array (bars), later nodes & edges (src/models)
 *   algorithms  — the algorithms themselves, they produce steps (src/algorithms)
 *
 * Dependencies go one way only: algorithms → models → core.
 */

/** A piece of the status line: plain text, or text in the colour of a mark (var(--viz-<mark>)). */
export type NotePart = string | { text: string; mark: string };

/**
 * One recorded moment of an algorithm run.
 * S — how the data looks (a snapshot in the format of the model),
 * E — what happened (an event in the format of the model).
 */
export interface Step<S = unknown, E = unknown> {
  /** The data after this step, including how to colour it. */
  state: S;
  /** What happened, machine-readable (for tests and the future modes Předpověz / Najdi chybu). */
  event: E;
  /** Human-readable status line shown after "step N / M", e.g. ["comparing", [3], [4]]. */
  note: NotePart[];
  /** Pseudocode line (1-based) executed by this step; 0 = no line. */
  line: number;
  /** Counters so far, e.g. { cmp: 4, swp: 1 }. */
  counters: Record<string, number>;
}

/** Data models the player can show. */
export type ModelId = "array";

/** Everything the site needs to know about one algorithm, except the long texts (those are in content.tsx). */
export interface AlgorithmDefinition<Input = unknown, S = unknown, E = unknown> {
  /** Part of the URL: /algorithms/<slug> */
  slug: string;
  name: string;
  /** Group shown on the card and in the breadcrumbs, e.g. "sorting", "search-sorted". */
  group: string;
  model: ModelId;
  level: "beginner" | "intermediate" | "advanced";
  complexity: string;
  /** Catalog card. */
  card: { tagline: string; description: string; badge: AlgorithmCardData["badge"] };
  /**
   * Runs the algorithm on the input and records every step.
   * (Method syntax on purpose: a definition with concrete types then fits where any definition is expected.)
   */
  trace(input: Input): Step<S, E>[];
  /**
   * Pseudocode lines that have no step of their own, mapped to a line that has one.
   * Clicking such a line jumps to the step of the mapped line.
   */
  lineAliases: Record<number, number>;
  /** Counters in the player head, in this order, e.g. [{ key: "cmp", label: "cmp" }]. */
  counters: { key: string; label: string }[];
  /** Marks shown in the colour legend next to the player. */
  legend: string[];
  /** Input the player starts with. */
  initialInput: Input;
  /** What a prepared input means for this algorithm, e.g. { sorted: "nejlepší případ" }. */
  inputHints?: Record<string, string>;
}

/** A data model: how its steps are drawn and how the user changes the input. */
export interface Model {
  /** Draws the state of one step in the player stage. */
  View: ComponentType<{ state: unknown }>;
  /** Side panel next to the player for changing the input. */
  InputPanel: ComponentType;
  /** Button with prepared inputs next to the speed button. */
  DataMenu: ComponentType;
  /** Colour and description of every mark, for the legend. */
  legend: Record<string, { color: string; desc: string; dim?: boolean }>;
}
