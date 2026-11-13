import { useEffect, type Dispatch } from "react";
import type { PlayerAction } from "./playerState";

/* Behaviour shared by every player of the site. */

/** While playing, moves one step forward every `stepMs` milliseconds. */
export function usePlaybackTimer(playing: boolean, stepMs: number, dispatch: Dispatch<PlayerAction>) {
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => dispatch({ type: "tick" }), stepMs);
    return () => clearInterval(timer);
  }, [playing, stepMs, dispatch]);
}

/** Keyboard: space = play/pause, ← / → = step, R = back to the start. */
export function useKeyboardControls(dispatch: Dispatch<PlayerAction>) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      // Typing into a field must not control the player.
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      if (event.key === " ") {
        // A focused button (also a clickable bar or vertex) already reacts to space by itself.
        if (target?.closest("button, a, [role=button]")) return;
        event.preventDefault();
        dispatch({ type: "toggle" });
      } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        dispatch({ type: "step", delta: event.key === "ArrowRight" ? 1 : -1 });
      } else if (event.key === "r" || event.key === "R") {
        dispatch({ type: "reset" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);
}
