"use client";

import { useEffect, useState } from "react";
import { VizBars } from "@/components/VizBars";
import { bubbleClass, buildBubbleSteps, pad, shuffled } from "@/lib/demoSteps";

const INITIAL = [5, 11, 2, 9, 14, 7, 12, 4, 8, 1, 10, 6];
const INITIAL_STEPS = buildBubbleSteps(INITIAL);
const STEP_MS = 420;

/** Looping bubble sort in the hero. When it finishes, it restarts on a reshuffled array. */
export function HeroDemo() {
  const [frame, setFrame] = useState({ steps: INITIAL_STEPS, index: 0, elapsed: 0 });

  useEffect(() => {
    let steps = INITIAL_STEPS;
    let index = 0;
    let startedAt = performance.now();
    const timer = setInterval(() => {
      index++;
      if (index >= steps.length) {
        steps = buildBubbleSteps(shuffled(INITIAL));
        index = 0;
        startedAt = performance.now();
      }
      setFrame({ steps, index, elapsed: (performance.now() - startedAt) / 1000 });
    }, STEP_MS);
    return () => clearInterval(timer);
  }, []);

  const step = frame.steps[frame.index];
  const action =
    step.kind === "cmp"
      ? `comparing [${step.j}] [${step.j + 1}]`
      : step.kind === "swp"
        ? `swapped [${step.j}] [${step.j + 1}]`
        : "sorted";

  return (
    <div className="hero-demo" aria-label="Bubble Sort demonstration">
      <div className="hero-demo-head">
        <div className="left">
          <span className="dot" />
          <span>Bubble Sort</span>
          <span className="v" style={{ color: "var(--color-text-dim)" }}>
            — live demo
          </span>
        </div>
        <div className="right">
          step <span className="accent">{pad(frame.index + 1)}</span> / <span>{pad(frame.steps.length)}</span> &nbsp;—&nbsp;{" "}
          <span>{action}</span>
        </div>
      </div>
      <VizBars values={step.a} classOf={(i) => bubbleClass(step, i)} />
      <div className="hero-demo-foot">
        <div className="metrics">
          <div className="metric">
            <span className="k">cmp</span>
            <span className="v">{pad(step.cmp)}</span>
          </div>
          <div className="metric">
            <span className="k">swp</span>
            <span className="v">{pad(step.swp)}</span>
          </div>
          <div className="metric">
            <span className="k">elapsed</span>
            <span className="v accent">{frame.elapsed.toFixed(2)}s</span>
          </div>
        </div>
        <div>n = 12 · auto-play</div>
      </div>
    </div>
  );
}
