"use client";

import { createContext, use, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { TRACERS } from "@/algorithms/tracers";
import type { ArrayStep } from "@/algorithms/types";
import type { Dataset } from "./datasets";
import { createPlayerState, playerReducer, STEP_MS, type PlayerAction, type PlayerState } from "./playerState";

interface PlayerContextValue {
  state: PlayerState;
  /** The step on screen (shortcut for state.steps[state.index]). */
  step: ArrayStep;
  dispatch: Dispatch<PlayerAction>;
  /** Replaces the input array and records a new run of the algorithm on it. */
  load: (input: number[], dataset: Dataset) => void;
  lineAliases: Record<number, number>;
  /** Label of the second counter: "swp", or "wrt" for algorithms that write instead of swapping. */
  swapLabel: string;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

/**
 * Holds the player state for the whole algorithm page, so that the sub-navigation,
 * the player, the input panel and the pseudocode all show the same step.
 */
export function PlayerProvider({ slug, initialInput, children }: {
  slug: string;
  initialInput: number[];
  children: ReactNode;
}) {
  const tracer = TRACERS[slug];
  if (!tracer) throw new Error(`No step generator for "${slug}" in src/algorithms/tracers.ts`);

  const [state, dispatch] = useReducer(playerReducer, null, () =>
    createPlayerState(initialInput, "random", tracer.trace(initialInput)),
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
    load: (input, dataset) => dispatch({ type: "load", input, dataset, steps: tracer.trace(input) }),
    lineAliases: tracer.lineAliases,
    swapLabel: tracer.swapLabel ?? "swp",
  };

  return <PlayerContext value={value}>{children}</PlayerContext>;
}

/** Access to the player from any component inside <PlayerProvider>. */
export function usePlayer(): PlayerContextValue {
  const player = use(PlayerContext);
  if (!player) throw new Error("usePlayer() must be used inside <PlayerProvider>");
  return player;
}
