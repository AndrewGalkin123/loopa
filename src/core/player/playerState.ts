import { isCorrect } from "@/core/prediction";
import type { Question, Reply, Step } from "@/core/types";

/*
 * Player state and every way it can change, in one pure function (a reducer).
 * Components never change the state directly — they send an action, e.g.
 * dispatch({ type: "step", delta: 1 }), and playerReducer returns the new state.
 * The player does not know what the data is (array, tree…): `input` and the
 * steps are handled by the model and the algorithm.
 *
 * In the mode "Předpověz" the player also stops at the questions of the algorithm:
 * moving forward onto the step of an unanswered question pauses it and asks.
 * Moving back, seeking and the mode "Sleduj" never ask.
 */

/** How long one step lasts at speed 1×, in milliseconds. */
export const STEP_MS = 400;

export const SPEEDS = [0.5, 1, 2, 4, 8];

/** "watch" only plays the run; "predict" also asks the questions of the algorithm. */
export type Mode = "watch" | "predict";

/** What became of a question: the reply (null = skipped) and whether it was right. */
export interface QuestionResult {
  reply: Reply | null;
  correct: boolean;
}

export interface PlayerState {
  /** The input of the algorithm (for arrays: number[]). */
  input: unknown;
  /** Where the input came from, e.g. "random", "sorted", "custom" (shown on the data button). */
  inputKind: string;
  /** Recorded run of the algorithm on `input`. */
  steps: Step[];
  /** Index of the step on screen. */
  index: number;
  playing: boolean;
  speed: number;
  mode: Mode;
  /** Questions for this run, ordered by their step (empty for algorithms without questions). */
  questions: Question[];
  /** Results by the position of the question in `questions`. */
  results: Record<number, QuestionResult>;
  /** The question on screen, and whether the playback goes on after it. */
  asking: { question: number; resume: boolean } | null;
}

export type PlayerAction =
  /** New input; `steps` (and the questions) are already computed for it. */
  | { type: "load"; input: unknown; inputKind: string; steps: Step[]; questions?: Question[] }
  /** Play / pause. During a question: go on (an unanswered question is skipped). */
  | { type: "toggle" }
  /** Sent by the timer while playing. */
  | { type: "tick" }
  | { type: "step"; delta: 1 | -1 }
  | { type: "seek"; index: number }
  | { type: "reset" }
  | { type: "speed"; speed: number }
  | { type: "mode"; mode: Mode }
  /** The answer to the question on screen. */
  | { type: "answer"; reply: Reply };

export function createPlayerState(input: unknown, inputKind: string, steps: Step[], questions: Question[] = []): PlayerState {
  return { input, inputKind, steps, index: 0, playing: false, speed: 1, mode: "watch", questions, results: {}, asking: null };
}

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  const last = state.steps.length - 1;

  switch (action.type) {
    case "load":
      return {
        ...state,
        input: action.input,
        inputKind: action.inputKind,
        steps: action.steps,
        questions: action.questions ?? [],
        results: {},
        asking: null,
        index: 0,
        playing: false,
      };

    case "toggle":
      if (state.asking) return leaveQuestion(state, true);
      if (state.playing) return { ...state, playing: false };
      // Play at the end starts over.
      return { ...state, playing: true, index: state.index >= last ? 0 : state.index };

    case "tick": {
      const index = Math.min(state.index + 1, last);
      return arrive(state, index, index < last);
    }

    // Manual stepping and seeking pause the playback.
    case "step":
      if (action.delta === 1) {
        // During a question "forward" means: skip it, or go on after the answer.
        if (state.asking) return leaveQuestion(state, false);
        return arrive(state, Math.min(state.index + 1, last), false);
      }
      return { ...state, playing: false, asking: null, index: Math.max(state.index - 1, 0) };

    case "seek":
      return { ...state, playing: false, asking: null, index: clamp(action.index, 0, last) };

    // Back to the start; the questions can be answered again.
    case "reset":
      return { ...state, playing: false, asking: null, results: {}, index: 0 };

    case "speed":
      return { ...state, speed: action.speed };

    case "mode":
      return { ...state, mode: action.mode, asking: null };

    case "answer": {
      if (!state.asking || state.asking.question in state.results) return state;
      const { question } = state.asking;
      const correct = isCorrect(state.questions[question].answer, action.reply);
      return { ...state, results: { ...state.results, [question]: { reply: action.reply, correct } } };
    }
  }
}

/** The first unanswered question of step `index`, or -1. */
function openQuestionAt(state: PlayerState, index: number): number {
  return state.questions.findIndex((question, i) => question.at === index && !(i in state.results));
}

/** Moving forward onto `index`: in the mode Předpověz an unanswered question there stops the player. */
function arrive(state: PlayerState, index: number, playing: boolean): PlayerState {
  const question = state.mode === "predict" ? openQuestionAt(state, index) : -1;
  if (question === -1) return { ...state, index, playing, asking: null };
  return { ...state, index, playing: false, asking: { question, resume: playing } };
}

/** Leaves the question on screen (unanswered = skipped) and goes on: to the next question of this step, or forward. */
function leaveQuestion(state: PlayerState, play: boolean): PlayerState {
  const { question, resume } = state.asking!;
  const results = question in state.results ? state.results : { ...state.results, [question]: { reply: null, correct: false } };
  const left = { ...state, results, asking: null };
  const playing = resume || play;

  const another = openQuestionAt(left, state.index);
  if (another !== -1) return { ...left, asking: { question: another, resume: playing } };

  const last = state.steps.length - 1;
  const index = Math.min(state.index + 1, last);
  return arrive(left, index, playing && index < last);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
