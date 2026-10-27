"use client";

import type { ReactNode } from "react";
import { CodeLine } from "@/components/code/tokens";
import { usePlayer } from "@/core/player/PlayerProvider";

/**
 * Pseudocode linked to the player: the line of the current step is highlighted,
 * and clicking a line jumps to the next step that executes it.
 */
export function Pseudocode({ lines }: { lines: ReactNode[] }) {
  const { state, step, dispatch, definition } = usePlayer();

  const jumpToLine = (line: number) => {
    const target = definition.lineAliases[line] ?? line;
    const isTarget = (s: { line: number }) => s.line === target;
    // The next such step after the current one; if there is none, the first one from the start.
    let index = state.steps.findIndex((s, i) => i > state.index && isTarget(s));
    if (index === -1) index = state.steps.findIndex(isTarget);
    if (index !== -1) dispatch({ type: "seek", index });
  };

  return (
    <div className="code">
      <pre className="code-body" style={{ margin: 0 }}>
        {lines.map((line, i) => (
          <CodeLine
            key={i}
            n={i + 1}
            className={i + 1 === step.line ? "clickable cur" : "clickable"}
            onClick={() => jumpToLine(i + 1)}
          >
            {line}
          </CodeLine>
        ))}
      </pre>
    </div>
  );
}
