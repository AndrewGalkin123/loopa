"use client";

import { useEffect, useState } from "react";
import { VizBars } from "@/components/VizBars";
import { bubbleClass, buildBubbleSteps, buildQuickSteps, pad, quickClass, randomArray } from "@/lib/demoSteps";

const INITIAL_INPUT = [12, 4, 19, 7, 22, 3, 15, 9, 27, 6, 17, 11, 24, 2, 14, 8];
const INITIAL_BUBBLE = buildBubbleSteps(INITIAL_INPUT);
const INITIAL_QUICK = buildQuickSteps(INITIAL_INPUT);
const BUBBLE_MS = 180;
// Quick sort has fewer steps, so it ticks slower and both finish at a similar pace.
const QUICK_MS = Math.max(120, Math.round(BUBBLE_MS * (INITIAL_BUBBLE.length / INITIAL_QUICK.length)));

/**
 * Bubble sort vs quick sort on the same input. Quick sort waits on its last
 * frame until bubble sort finishes; then both restart on a new random array.
 */
export function CompareDemo() {
  const [frame, setFrame] = useState({
    bubble: INITIAL_BUBBLE,
    quick: INITIAL_QUICK,
    bi: 0,
    qi: 0,
    elapsed: 0,
  });

  useEffect(() => {
    let bubble = INITIAL_BUBBLE;
    let quick = INITIAL_QUICK;
    let bi = 0;
    let qi = 0;
    let startedAt = performance.now();
    const paint = () => setFrame({ bubble, quick, bi, qi, elapsed: (performance.now() - startedAt) / 1000 });

    const bubbleTimer = setInterval(() => {
      bi++;
      if (bi >= bubble.length) {
        const input = randomArray(16);
        bubble = buildBubbleSteps(input);
        quick = buildQuickSteps(input);
        bi = 0;
        qi = 0;
        startedAt = performance.now();
      }
      paint();
    }, BUBBLE_MS);

    const quickTimer = setInterval(() => {
      if (qi < quick.length - 1) qi++;
      paint();
    }, QUICK_MS);

    return () => {
      clearInterval(bubbleTimer);
      clearInterval(quickTimer);
    };
  }, []);

  const b = frame.bubble[frame.bi];
  const q = frame.quick[frame.qi];
  const time = `${frame.elapsed.toFixed(2)}s`;

  return (
    <div className="compare-grid">
      <div className="compare-panel">
        <div className="head">
          <div className="name">
            Bubble Sort <em>— simple</em>
          </div>
          <div className="step">
            step <span className="accent">{pad(frame.bi + 1)}</span> / 66
          </div>
        </div>
        <VizBars values={b.a} classOf={(i) => bubbleClass(b, i)} />
        <div className="footrow">
          <div className="metric">
            <span className="k">cmp</span>
            <span className="v">{pad(b.cmp)}</span>
          </div>
          <div className="metric">
            <span className="k">swp</span>
            <span className="v">{pad(b.swp)}</span>
          </div>
          <div className="metric">
            <span className="k">elapsed</span>
            <span className="v">{time}</span>
          </div>
        </div>
      </div>

      <div className="compare-panel winner">
        <div className="head">
          <div className="name">
            Quicksort <em>— divide</em>
          </div>
          <div className="step">
            step <span className="accent">{pad(frame.qi + 1)}</span> / 24
          </div>
        </div>
        <VizBars values={q.a} classOf={(i) => quickClass(q, i)} />
        <div className="footrow">
          <div className="metric">
            <span className="k">cmp</span>
            <span className="v accent">{pad(q.cmp)}</span>
          </div>
          <div className="metric">
            <span className="k">swp</span>
            <span className="v accent">{pad(q.swp)}</span>
          </div>
          <div className="metric">
            <span className="k">elapsed</span>
            <span className="v accent">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
