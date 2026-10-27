"use client";

import { createContext, use, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import type { AlgorithmDefinition, Model, Step } from "@/core/types";
import { createPlayerState, playerReducer, STEP_MS, type PlayerAction, type PlayerState } from "./playerState";

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
export function PlayerProvider({ definition, model, children }: {
  definition: AlgorithmDefinition;
  model: Model;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(playerReducer, null, () =>
    createPlayerState(definition.initialInput, "random", definition.trace(definition.initialInput)),
  );

  // While playing, move one step forward every STEP_MS / speed milliseconds.
  useEffect(() => {
    if (!state.playing) return;
    const timer = setInterval(() => dispatch({ type: "tick" }), STEP_MS / state.speed);
    return () => clearInterval(timer);
  }, [state.playing, state.speed]);

  const value: PlayerContextValue = {
    state,
    step: state.steps[state.index],
    dispatch,
    load: (input, inputKind) => dispatch({ type: "load", input, inputKind, steps: definition.trace(input) }),
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
