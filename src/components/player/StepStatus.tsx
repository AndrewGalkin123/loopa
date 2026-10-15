"use client";

import { pad } from "@/lib/demoSteps";
import { usePlayer } from "./PlayerProvider";

/** "step 07 / 24" in the sticky sub-navigation. */
export function StepStatus() {
  const { state } = usePlayer();
  return (
    <span className="mini-status">
      step <span className="accent">{pad(state.index + 1)}</span> / {state.steps.length}
    </span>
  );
}
