"use client";

import { useEffect, useState, type ReactNode } from "react";
import { findAlgorithm } from "@/algorithms/registry";
import { PlayerLegend } from "@/components/algorithm/Legend";
import { Player } from "@/core/player/Player";
import { PlayerProvider } from "@/core/player/PlayerProvider";
import type { PlayerAction, PlayerState } from "@/core/player/playerState";
import { BLOCK_SECONDS, type BlockRecord } from "@/lib/study";
import { MODELS } from "@/models";
import { KeyStates } from "./KeyStates";

/** "11:42" */
export function clock(seconds: number) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/**
 * One block of study as the participant sees it: a bar with the time left, then
 * either the trainer (the player) or the control condition (still pictures),
 * and under it the same texts in both conditions. No site navigation, no AI assistant.
 */
export function StudyBlock({ block, lede, texts, onAction, onEnd }: {
  block: BlockRecord;
  lede: ReactNode;
  /** Description, pseudocode, implementations and complexity, rendered on the server. */
  texts: ReactNode;
  onAction: (action: PlayerAction, state: PlayerState) => void;
  onEnd: (endedBy: "time" | "researcher") => void;
}) {
  const definition = findAlgorithm(block.algorithm)!;
  const model = MODELS[definition.model];
  const startedAt = block.startedAt!;
  const [now, setNow] = useState(startedAt);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  const left = BLOCK_SECONDS - (now - startedAt) / 1000;
  useEffect(() => {
    if (left <= 0) onEnd("time");
  }, [left, onEnd]);

  return (
    <div className="page-algorithm page-study">
      <div className="study-bar">
        <span className="study-brand">Loopa — studium</span>
        <span className="study-algorithm">{definition.name}</span>
        <span className={left <= 60 ? "study-timer low" : "study-timer"} aria-label="Zbývající čas">
          {clock(left)}
        </span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (window.confirm("Ukončit blok před vypršením času? Skutečná délka se zapíše do logu.")) onEnd("researcher");
          }}
        >
          Ukončit blok
        </button>
      </div>

      <main>
        <section className="algo-hero">
          <h1>{definition.name}</h1>
          <p className="lede">{lede}</p>
        </section>

        {block.condition === "trainer" ? (
          // Předpověz from the start: the trainer is defined by it (VO2, part 4.3).
          <PlayerProvider definition={definition} model={model} initialMode="predict" onAction={onAction}>
            <section className="workspace">
              <Player />
              <aside className="side-panel">
                <model.InputPanel />
                <PlayerLegend />
              </aside>
            </section>
            {texts}
          </PlayerProvider>
        ) : (
          <>
            <KeyStates slug={block.algorithm} />
            {texts}
          </>
        )}
      </main>
    </div>
  );
}
