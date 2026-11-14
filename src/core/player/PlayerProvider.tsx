"use client";

import { createContext, use, useReducer, type Dispatch, type ReactNode } from "react";
import type { AlgorithmDefinition, Model, Step } from "@/core/types";
import { usePlaybackTimer } from "./usePlayerControls";
import { createPlayerState, playerReducer, STEP_MS, type Mode, type PlayerAction, type PlayerState } from "./playerState";

interface PlayerContextValue {
  state: PlayerState;
  /** The step on screen (shortcut for state.steps[state.index]). */
  step: Step;
  dispatch: Dispatch<PlayerAction>;
  /** Replaces the input and records a new run of the algorithm on it. */
  load: (input: unknown, inputKind: string) => void;
  /** The algorithm being played. */
  definition: AlgorithmDefinition;
  /** Its data model: how the steps are drawn and how the input is changed. */
  model: Model;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

/**
 * Holds the player state for the whole algorithm page, so that the sub-navigation,
 * the player, the input panel and the pseudocode all show the same step.
 */
export function PlayerProvider({ definition, model, initialMode = "watch", onAction, children }: {
  definition: AlgorithmDefinition;
  model: Model;
  /** The mode the player starts in ("Sleduj" on the site, "Předpověz" in the research session). */
  initialMode?: Mode;
  /** Called with every action of the user and the state before it (the research session records them). */
  onAction?: (action: PlayerAction, state: PlayerState) => void;
  children: ReactNode;
}) {
  const [state, reduce] = useReducer(playerReducer, null, () => {
    const steps = definition.trace(definition.initialInput);
    const questions = definition.questions?.(steps);
    return createPlayerState(definition.initialInput, definition.initialInputKind ?? "random", steps, questions, initialMode);
  });

  // The timer's ticks are not actions of the user, so they go straight to the reducer.
  usePlaybackTimer(state.playing, STEP_MS / state.speed, reduce);
  const dispatch = onAction
    ? (action: PlayerAction) => {
        onAction(action, state);
        reduce(action);
      }
    : reduce;

  const value: PlayerContextValue = {
    state,
    step: state.steps[state.index],
    dispatch,
    load: (input, inputKind) => {
      const steps = definition.trace(input);
      dispatch({ type: "load", input, inputKind, steps, questions: definition.questions?.(steps) });
    },
    definition,
    model,
  };

  return <PlayerContext value={value}>{children}</PlayerContext>;
}

/** Access to the player from any component inside <PlayerProvider>. */
export function usePlayer(): PlayerContextValue {
  const player = use(PlayerContext);
  if (!player) throw new Error("usePlayer() must be used inside <PlayerProvider>");
  return player;
}

/** The player, or null for a picture shown outside of it (a still picture of a key state). */
export function useOptionalPlayer(): PlayerContextValue | null {
  return use(PlayerContext);
}
