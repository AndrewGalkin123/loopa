"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";

/** Play button of the demo player; only swaps its icon between play and pause. */
export function PlayToggle() {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      className="btn btn-primary btn-icon"
      aria-label={playing ? "Pause" : "Play"}
      onClick={() => setPlaying((value) => !value)}
    >
      {playing ? <Pause size={16} /> : <Play size={16} />}
    </button>
  );
}
