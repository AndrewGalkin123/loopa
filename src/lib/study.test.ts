import { describe, expect, test } from "vitest";
import { createPlayerState, playerReducer, type PlayerAction, type PlayerState } from "@/core/player/playerState";
import type { Question, Step } from "@/core/types";
import {
  BLOCK_SECONDS,
  endBlock,
  eventsOf,
  exportSession,
  newSession,
  PARTICIPANT_ID,
  planBlocks,
  recordEvents,
  stage,
  startBlock,
  summarize,
  type SessionEvent,
} from "./study";

describe("plan of the session", () => {
  test("group A: X in the trainer, Y in the control condition; group B the other way round", () => {
    expect(planBlocks("vs", "A")).toEqual([
      { algorithm: "quick-sort", condition: "trainer" },
      { algorithm: "dijkstra", condition: "control" },
    ]);
    expect(planBlocks("ss", "B")).toEqual([
      { algorithm: "insertion-sort", condition: "control" },
      { algorithm: "bfs", condition: "trainer" },
    ]);
  });

  test("a participant is a code, not a name", () => {
    expect(PARTICIPANT_ID.test("P07")).toBe(true);
    expect(PARTICIPANT_ID.test("P123")).toBe(true);
    expect(PARTICIPANT_ID.test("Petr")).toBe(false);
    expect(PARTICIPANT_ID.test("07")).toBe(false);
  });
});

describe("what the log records", () => {
  const steps: Step[] = Array.from({ length: 6 }, (_, i) => ({ state: i, event: {}, note: [], line: 0, counters: {} }));
  const questions: Question[] = [{ at: 2, prompt: ["?"], answer: { kind: "yes-no", correct: true }, explain: ["."] }];
  const start = createPlayerState(null, "random", steps, questions, "predict");
  /** The events of a sequence of actions, each one with the state before it. */
  const log = (...actions: PlayerAction[]) => {
    let state: PlayerState = start;
    return actions.flatMap((action) => {
      const events = eventsOf(action, state);
      state = playerReducer(state, action);
      return events;
    });
  };

  test("steps, answers and what forward means during a question", () => {
    expect(log({ type: "step", delta: 1 }, { type: "step", delta: 1 }, { type: "answer", reply: false }, { type: "step", delta: 1 })).toEqual([
      { type: "forward" },
      { type: "forward" },
      { type: "answer", correct: false },
      { type: "forward" },
    ]);
    expect(log({ type: "seek", index: 1 }, { type: "step", delta: 1 }, { type: "step", delta: 1 }, { type: "step", delta: -1 })).toEqual([
      { type: "seek" },
      { type: "forward" },
      { type: "skip" },
      { type: "back" },
    ]);
  });

  test("play during a question skips it; the timer, a second answer and the same mode are not recorded", () => {
    expect(log({ type: "toggle" }, { type: "tick" }, { type: "tick" }, { type: "toggle" })).toEqual([
      { type: "play" },
      { type: "skip" },
      { type: "play" },
    ]);
    expect(log({ type: "mode", mode: "predict" }, { type: "mode", mode: "watch" }, { type: "speed", speed: 2 })).toEqual([
      { type: "mode", mode: "watch" },
    ]);
  });

  test("new inputs keep their kind", () => {
    expect(log({ type: "load", input: null, inputKind: "sorted", steps })).toEqual([{ type: "input", kind: "sorted" }]);
  });
});

describe("summary of a block", () => {
  const events: SessionEvent[] = [
    { type: "start", t: 0 },
    { type: "forward", t: 2 },
    { type: "answer", correct: true, t: 5 },
    { type: "answer", correct: false, t: 9 },
    { type: "skip", t: 11 },
    { type: "mode", mode: "watch", t: 100 },
    { type: "back", t: 120 },
    { type: "input", kind: "random", t: 130 },
    { type: "input", kind: "custom", t: 140 },
    { type: "input", kind: "custom", t: 141 },
    { type: "input", kind: "custom", t: 142 },
    { type: "forward", t: 150 },
    { type: "input", kind: "custom", t: 160 },
    { type: "mode", mode: "predict", t: 300 },
    { type: "resume", t: 500 },
    { type: "mode", mode: "watch", t: 600 },
  ];

  test("counts, own inputs in a row count once, time in each mode (a reload starts in Předpověz again)", () => {
    expect(summarize([...events, { type: "end", t: 720 }], 720)).toEqual({
      forward: 2,
      back: 1,
      seeks: 0,
      plays: 0,
      predictions: 2,
      correct: 1,
      skipped: 1,
      secondsWatch: 200 + 120,
      secondsPredict: 100 + 200 + 100,
      presetInputs: 1,
      customInputs: 2,
    });
  });
});

describe("course of a session", () => {
  test("block 1, a pause between the blocks, block 2, done; the file holds no clock time", () => {
    const now = Date.UTC(2027, 3, 12, 9, 0, 0);
    let session = newSession("P07", "vs", "A", "AB", new Date(now));
    expect(stage(session)).toEqual({ kind: "between", block: 0 });

    session = startBlock(session, 0, now);
    expect(stage(session)).toEqual({ kind: "block", block: 0 });
    session = recordEvents(session, 0, [{ type: "forward" }], now + 3_000);
    session = endBlock(session, 0, now + 800_000, "time");
    expect(session.blocks[0].seconds).toBe(BLOCK_SECONDS);
    expect(stage(session)).toEqual({ kind: "between", block: 1 });

    session = startBlock(session, 1, now + 1_500_000);
    session = endBlock(session, 1, now + 1_500_000 + 65_400, "researcher");
    expect(stage(session)).toEqual({ kind: "done" });

    const file = exportSession(session);
    expect(file).toMatchObject({ participant: "P07", variant: "VŠ", group: "A", forms: "pre A / post B", date: "2027-04-12" });
    expect(file.blocks[0].events).toEqual([
      { type: "start", t: 0 },
      { type: "forward", t: 3 },
      { type: "end", t: 720 },
    ]);
    expect(file.blocks[0].summary).toMatchObject({ forward: 1, secondsPredict: 720 });
    expect(file.blocks[1]).toMatchObject({ algorithm: "dijkstra", condition: "control", seconds: 65.4, endedBy: "researcher", summary: null });
    expect(JSON.stringify(file)).not.toContain("startedAt");
  });
});
