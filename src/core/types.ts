import type { ComponentType } from "react";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/*
 * The contract between the three layers:
 *
 *   core        — knows only these types; plays steps (src/core/player)
 *   models      — how the data looks: array (bars), graph (nodes & edges), search (src/models)
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
  /** What happened, machine-readable (for tests, the questions of Předpověz and the future Najdi chybu). */
  event: E;
  /** Human-readable status line shown after "step N / M", e.g. ["comparing", [3], [4]]. */
  note: NotePart[];
  /** Pseudocode line (1-based) executed by this step; 0 = no line. */
  line: number;
  /** Counters so far, e.g. { cmp: 4, swp: 1 }. */
  counters: Record<string, number>;
}

/**
 * A question of the mode "Předpověz" (predict the next step): the player stops at
 * step `at` and asks what happens next. The whole run is recorded in advance,
 * so the right answer is already known.
 */
export interface Question {
  /** Index of the step on screen while the question is asked. */
  at: number;
  /** The question including how to answer it, e.g. ["Klíč", "2", "— kam se vloží? Klikni na sloupec."]. */
  prompt: NotePart[];
  answer: Answer;
  /** Why the right answer is right; shown after answering. */
  explain: NotePart[];
  /** Parts of the picture that would give the answer away, hidden while the question waits (e.g. the list "queue"). */
  hide?: string[];
}

/** The right answer and how it is given. Ids are what the picture shows: bar indices ("3") or vertices ("B"). */
export type Answer =
  /** One click on the picture; any id in `correct` is right (usually there is only one). */
  | { kind: "pick"; correct: string[] }
  /** Clicks on the picture in this order; an empty list means "none". */
  | { kind: "sequence"; correct: string[] }
  | { kind: "yes-no"; correct: boolean };

/** What the user answered: the clicked ids, or yes / no. */
export type Reply = string[] | boolean;

/** What the picture of a model needs while a question is on screen. */
export interface PredictionView {
  /** Present while the answer is given by clicking: the bars / vertices become clickable. */
  onPick?: (id: string) => void;
  /** Clicked so far, or the given answer. */
  chosen: string[];
  /** After the answer: the right ids. */
  correct?: string[];
  /** Parts of the picture to hide (see Question.hide). */
  hide?: string[];
}

/** Data models the player can show. */
export type ModelId = "array" | "graph" | "search";

/** Everything the site needs to know about one algorithm, except the long texts (those are in content.tsx). */
export interface AlgorithmDefinition<Input = unknown, S = unknown, E = unknown> {
  /** Part of the URL: /algorithms/<slug> */
  slug: string;
  name: string;
  /** Group shown on the card and in the breadcrumbs, e.g. "sorting", "search". */
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
  /** Descriptions that replace the model's ones in the legend, e.g. { frontier: "ve frontě" }. */
  legendDescriptions?: Record<string, string>;
  /** Input the player starts with. */
  initialInput: Input;
  /** What kind of input that is (shown on the data button); "random" by default. */
  initialInputKind?: string;
  /** What a prepared input means for this algorithm, e.g. { sorted: "nejlepší případ" }. */
  inputHints?: Record<string, string>;
  /** Questions of the mode "Předpověz" for one recorded run. Without them the algorithm has no such mode. */
  questions?(steps: Step<S, E>[]): Question[];
}

/** A data model: how its steps are drawn and how the user changes the input. */
export interface Model {
  /** Draws the state of one step in the player stage (and, during a question, lets the user click on it). */
  View: ComponentType<{ state: unknown; prediction?: PredictionView }>;
  /** Side panel next to the player for changing the input. */
  InputPanel: ComponentType;
  /** Button with prepared inputs next to the speed button. */
  DataMenu: ComponentType;
  /** Colour and description of every mark, for the legend. */
  legend: Record<string, { color: string; desc: string; dim?: boolean }>;
}
