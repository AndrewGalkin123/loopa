import { Check } from "lucide-react";
import { Badge } from "@/components/Badge";
import { VizBars } from "@/components/VizBars";
import { Note } from "@/core/player/Note";
import { pad } from "@/lib/demoSteps";
import type { Comparable } from "@/lib/compare";
import type { ArrayStep } from "@/models/array/types";

/** One algorithm in the duo: its name and state, bars, own progress, counters and status line. */
export function CompareColumn({ side, definition, step, ops, total, seconds, started, waiting }: {
  side: "left" | "right";
  definition: Comparable;
  step: ArrayStep;
  ops: number;
  total: number;
  seconds: string;
  /** The shared clock has moved. */
  started: boolean;
  /** The other algorithm is still running. */
  waiting: boolean;
}) {
  const done = ops >= total;
  return (
    <div className={`col ${side}`}>
      <div className="col-head">
        <div className="l">
          <div className="name-row">
            <span className="name">
              {definition.name} <em>— {definition.card.tagline}</em>
            </span>
            <Badge variant={definition.card.badge.variant} icon={definition.card.badge.icon}>
              {definition.card.badge.label}
            </Badge>
          </div>
          {done ? (
            <span className="status done">
              <Check /> done
            </span>
          ) : (
            <span className="status running">
              <span className="ic" /> {started ? "running" : "ready"}
            </span>
          )}
        </div>
      </div>
      <div className="stage">
        <VizBars values={step.state.values} classOf={(i) => step.state.marks[i] ?? ""} />
      </div>
      <div className="col-progress">
        <div className={`fill ${done ? "done" : "running"}`} style={{ width: `${total > 0 ? (ops / total) * 100 : 100}%` }} />
      </div>
      <div className="col-metrics">
        {definition.counters.map((counter) => (
          <div className={done ? "metric frozen" : "metric"} key={counter.key}>
            <span className="k">{counter.label}</span>
            <span className="v">{pad(step.counters[counter.key] ?? 0)}</span>
          </div>
        ))}
        <div className={done ? "metric frozen" : "metric"}>
          <span className="k">elapsed</span>
          <span className="v">{seconds}s</span>
        </div>
      </div>
      <div className="step-row">
        <span>
          op <span className={done ? "done-c" : "accent"}>{ops}</span> / {total}
        </span>
        <span className={done ? "done-c" : undefined}>{done ? (waiting ? "✓ seřazeno · čeká" : "✓ seřazeno") : <Note parts={step.note} />}</span>
      </div>
    </div>
  );
}
