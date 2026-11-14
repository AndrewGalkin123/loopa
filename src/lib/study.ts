import type { Slug } from "@/algorithms/registry";
import type { Mode, PlayerAction, PlayerState } from "@/core/player/playerState";
import { isCorrect } from "@/core/prediction";

/*
 * The research session of VO2 (docs/research/01-ramec-vyzkumu.md, 4.2–4.7).
 * A participant studies two algorithms for 12 minutes each: one in the trainer
 * (the player), the other in the control condition (the same texts with still
 * pictures). The log of what they did stays in the researcher's browser until the
 * researcher downloads it; nothing is sent anywhere, and it holds no name, only a code.
 */

export type Variant = "vs" | "ss";
export type Group = "A" | "B";
export type Condition = "trainer" | "control";
/** Which form of the test is the pretest: "AB" = pre A, post B. */
export type Forms = "AB" | "BA";

/** The two algorithms of each variant of the research: X (block 1), then Y (block 2). */
export const VARIANTS: Record<Variant, { label: string; algorithms: [Slug, Slug] }> = {
  vs: { label: "VŠ", algorithms: ["quick-sort", "dijkstra"] },
  ss: { label: "SŠ", algorithms: ["insertion-sort", "bfs"] },
};

export const CONDITION_LABELS: Record<Condition, string> = { trainer: "trenažér", control: "kontrola" };

/** How long one block of study lasts. */
export const BLOCK_SECONDS = 12 * 60;

/** A code like P07 — never a name. */
export const PARTICIPANT_ID = /^P\d{1,3}$/;

/** Group A studies X in the trainer and Y in the control condition, group B the other way round. */
export function planBlocks(variant: Variant, group: Group): { algorithm: Slug; condition: Condition }[] {
  const [x, y] = VARIANTS[variant].algorithms;
  return group === "A"
    ? [{ algorithm: x, condition: "trainer" }, { algorithm: y, condition: "control" }]
    : [{ algorithm: x, condition: "control" }, { algorithm: y, condition: "trainer" }];
}

/** One thing that happened in a block. */
export type EventData =
  | { type: "start" | "end" | "resume" | "forward" | "back" | "seek" | "play" | "pause" | "reset" | "skip" }
  | { type: "mode"; mode: Mode }
  | { type: "answer"; correct: boolean }
  /** New input: a prepared one (its kind, e.g. "random") or the participant's own ("custom"). */
  | { type: "input"; kind: string };

/** An event `t` seconds after the start of the block. ("resume" = the page was reloaded during the block.) */
export type SessionEvent = EventData & { t: number };

/** What an action of the participant means for the log; the state is the one before the action. */
export function eventsOf(action: PlayerAction, state: PlayerState): EventData[] {
  const open = state.asking !== null && !(state.asking.question in state.results);
  switch (action.type) {
    case "step":
      if (action.delta === -1) return [{ type: "back" }];
      // During a question "forward" skips it, or goes on after the answer.
      return [{ type: open ? "skip" : "forward" }];
    case "toggle":
      if (state.asking) return [{ type: open ? "skip" : "forward" }, { type: "play" }];
      return [{ type: state.playing ? "pause" : "play" }];
    case "seek":
      return [{ type: "seek" }];
    case "reset":
      return [{ type: "reset" }];
    case "mode":
      return action.mode === state.mode ? [] : [{ type: "mode", mode: action.mode }];
    case "answer":
      if (!open) return [];
      return [{ type: "answer", correct: isCorrect(state.questions[state.asking!.question].answer, action.reply) }];
    case "load":
      return [{ type: "input", kind: action.inputKind }];
    case "tick":
    case "speed":
      return [];
  }
}

/** The four measures of part 4.7 for one block in the trainer. */
export interface Summary {
  forward: number;
  back: number;
  seeks: number;
  plays: number;
  /** Answered questions of the mode Předpověz, the right ones, and the skipped ones. */
  predictions: number;
  correct: number;
  skipped: number;
  secondsWatch: number;
  secondsPredict: number;
  /** New prepared inputs, and own inputs (a run of edits in a row counts as one). */
  presetInputs: number;
  customInputs: number;
}

export function summarize(events: SessionEvent[], seconds: number, startMode: Mode = "predict"): Summary {
  const summary: Summary = {
    forward: 0, back: 0, seeks: 0, plays: 0, predictions: 0, correct: 0, skipped: 0,
    secondsWatch: 0, secondsPredict: 0, presetInputs: 0, customInputs: 0,
  };
  const time: Record<Mode, number> = { watch: 0, predict: 0 };
  let mode = startMode;
  let since = 0;
  let previous: SessionEvent | null = null;

  for (const event of events) {
    // A reload starts the player again in its first mode.
    if (event.type === "mode" || event.type === "resume") {
      time[mode] += event.t - since;
      since = event.t;
      mode = event.type === "mode" ? event.mode : startMode;
    }
    if (event.type === "forward") summary.forward++;
    if (event.type === "back") summary.back++;
    if (event.type === "seek") summary.seeks++;
    if (event.type === "play") summary.plays++;
    if (event.type === "skip") summary.skipped++;
    if (event.type === "answer") {
      summary.predictions++;
      if (event.correct) summary.correct++;
    }
    if (event.type === "input") {
      if (event.kind !== "custom") summary.presetInputs++;
      else if (!(previous?.type === "input" && previous.kind === "custom")) summary.customInputs++;
    }
    previous = event;
  }
  time[mode] += seconds - since;
  summary.secondsWatch = round(time.watch);
  summary.secondsPredict = round(time.predict);
  return summary;
}

/* ───────── The session and its blocks ───────── */

export interface BlockRecord {
  algorithm: Slug;
  condition: Condition;
  /** When the block started (ms since 1970), null before it. */
  startedAt: number | null;
  /** How long it lasted, null until it ends. */
  seconds: number | null;
  endedBy: "time" | "researcher" | null;
  events: SessionEvent[];
}

export interface Session {
  participant: string;
  variant: Variant;
  group: Group;
  forms: Forms;
  /** Only the day, e.g. "2027-04-12". */
  date: string;
  blocks: BlockRecord[];
}

export function newSession(participant: string, variant: Variant, group: Group, forms: Forms, today: Date): Session {
  return {
    participant,
    variant,
    group,
    forms,
    date: today.toISOString().slice(0, 10),
    blocks: planBlocks(variant, group).map((block) => ({ ...block, startedAt: null, seconds: null, endedBy: null, events: [] })),
  };
}

/** Where the session is: a block running, waiting for the next one, or done. */
export function stage(session: Session): { kind: "block" | "between"; block: number } | { kind: "done" } {
  const running = session.blocks.findIndex((b) => b.startedAt !== null && b.seconds === null);
  if (running !== -1) return { kind: "block", block: running };
  const next = session.blocks.findIndex((b) => b.startedAt === null);
  return next === -1 ? { kind: "done" } : { kind: "between", block: next };
}

const changeBlock = (session: Session, index: number, change: (block: BlockRecord) => BlockRecord): Session => ({
  ...session,
  blocks: session.blocks.map((block, i) => (i === index ? change(block) : block)),
});

/** Seconds since the start of the block, at most the length of a block. */
const elapsed = (block: BlockRecord, now: number) => round(Math.min(BLOCK_SECONDS, (now - block.startedAt!) / 1000));

export function startBlock(session: Session, index: number, now: number): Session {
  return changeBlock(session, index, (block) => ({ ...block, startedAt: now, events: [{ type: "start", t: 0 }] }));
}

export function recordEvents(session: Session, index: number, events: EventData[], now: number): Session {
  if (events.length === 0) return session;
  return changeBlock(session, index, (block) => ({
    ...block,
    events: [...block.events, ...events.map((event) => ({ ...event, t: elapsed(block, now) }))],
  }));
}

export function endBlock(session: Session, index: number, now: number, endedBy: "time" | "researcher"): Session {
  return changeBlock(session, index, (block) => {
    const seconds = endedBy === "time" ? BLOCK_SECONDS : elapsed(block, now);
    return { ...block, seconds, endedBy, events: [...block.events, { type: "end", t: seconds }] };
  });
}

/** The downloaded file: the session without clock times, with the summary of every trainer block. */
export function exportSession(session: Session) {
  return {
    participant: session.participant,
    variant: VARIANTS[session.variant].label,
    group: session.group,
    forms: session.forms === "AB" ? "pre A / post B" : "pre B / post A",
    date: session.date,
    blocks: session.blocks.map((block) => ({
      algorithm: block.algorithm,
      condition: block.condition,
      seconds: block.seconds,
      endedBy: block.endedBy,
      summary: block.condition === "trainer" && block.seconds !== null ? summarize(block.events, block.seconds) : null,
      events: block.events,
    })),
  };
}

function round(seconds: number) {
  return Math.round(seconds * 10) / 10;
}
