import type { Step } from "@/core/types";

/*
 * Player state and every way it can change, in one pure function (a reducer).
 * Components never change the state directly — they send an action, e.g.
 * dispatch({ type: "step", delta: 1 }), and playerReducer returns the new state.
 * The player does not know what the data is (array, tree…): `input` and the
 * steps are handled by the model and the algorithm.
 */

/** How long one step lasts at speed 1×, in milliseconds. */
export const STEP_MS = 400;

export const SPEEDS = [0.5, 1, 2, 4, 8];

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
}

export type PlayerAction =
  /** New input; `steps` are already computed for it. */
  | { type: "load"; input: unknown; inputKind: string; steps: Step[] }
  | { type: "toggle" }
  /** Sent by the timer while playing. */
  | { type: "tick" }
  | { type: "step"; delta: 1 | -1 }
  | { type: "seek"; index: number }
  | { type: "reset" }
  | { type: "speed"; speed: number };

export function createPlayerState(input: unknown, inputKind: string, steps: Step[]): PlayerState {
  return { input, inputKind, steps, index: 0, playing: false, speed: 1 };
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
        index: 0,
        playing: false,
      };

    case "toggle":
      if (state.playing) return { ...state, playing: false };
      // Play at the end starts over.
      return { ...state, playing: true, index: state.index >= last ? 0 : state.index };

    case "tick": {
      const index = Math.min(state.index + 1, last);
      return { ...state, index, playing: index < last };
    }

    // Manual stepping and seeking pause the playback.
    case "step":
      return { ...state, playing: false, index: clamp(state.index + action.delta, 0, last) };

    case "seek":
      return { ...state, playing: false, index: clamp(action.index, 0, last) };

    case "reset":
      return { ...state, playing: false, index: 0 };

    case "speed":
      return { ...state, speed: action.speed };
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
