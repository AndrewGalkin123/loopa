import { describe, expect, test } from "vitest";
import { isCorrect, pickClass } from "@/core/prediction";
import type { Answer, Question, Step } from "@/core/types";
import { createPlayerState, playerReducer, type PlayerAction, type PlayerState } from "./playerState";

/* The rules of stopping at questions (the mode Předpověz) and of checking answers. */

const steps: Step[] = Array.from({ length: 8 }, (_, i) => ({ state: i, event: {}, note: [`step ${i}`], line: 0, counters: {} }));
const question = (at: number, correct = true): Question => ({
  at,
  prompt: ["?"],
  answer: { kind: "yes-no", correct },
  explain: ["because"],
});
const questions = [question(2), question(4), question(4, false)];

const run = (state: PlayerState, ...actions: PlayerAction[]) => actions.reduce(playerReducer, state);
const predicting = () => run(createPlayerState(null, "random", steps, questions), { type: "mode", mode: "predict" });

describe("mode Předpověz", () => {
  test("stepping forward stops at a question and does not move on by itself", () => {
    const state = run(predicting(), { type: "step", delta: 1 }, { type: "step", delta: 1 });
    expect(state.index).toBe(2);
    expect(state.asking).toEqual({ question: 0, resume: false });
  });

  test("playing stops at a question and plays on after the answer", () => {
    let state = run(predicting(), { type: "toggle" }, { type: "tick" }, { type: "tick" });
    expect(state).toMatchObject({ index: 2, playing: false, asking: { question: 0, resume: true } });
    state = run(state, { type: "answer", reply: true });
    expect(state.results[0]).toEqual({ reply: true, correct: true });
    state = run(state, { type: "step", delta: 1 });
    expect(state).toMatchObject({ index: 3, playing: true, asking: null });
  });

  test("forward without an answer skips the question", () => {
    const state = run(predicting(), { type: "seek", index: 1 }, { type: "step", delta: 1 }, { type: "step", delta: 1 });
    expect(state.results[0]).toEqual({ reply: null, correct: false });
    expect(state.index).toBe(3);
  });

  test("two questions of one step are asked one after another", () => {
    let state = run(predicting(), { type: "seek", index: 3 }, { type: "step", delta: 1 });
    expect(state.asking?.question).toBe(1);
    state = run(state, { type: "answer", reply: false }, { type: "step", delta: 1 });
    expect(state).toMatchObject({ index: 4, asking: { question: 2 } });
    state = run(state, { type: "answer", reply: false }, { type: "step", delta: 1 });
    expect(state).toMatchObject({ index: 5, asking: null });
    expect(state.results).toEqual({ 1: { reply: false, correct: false }, 2: { reply: false, correct: true } });
  });

  test("an answered question is not asked again; reset makes all of them new", () => {
    let state = run(predicting(), { type: "seek", index: 1 }, { type: "step", delta: 1 }, { type: "answer", reply: true });
    state = run(state, { type: "step", delta: 1 }, { type: "step", delta: -1 }, { type: "step", delta: -1 }, { type: "step", delta: 1 });
    expect(state).toMatchObject({ index: 2, asking: null });
    state = run(state, { type: "reset" }, { type: "step", delta: 1 }, { type: "step", delta: 1 });
    expect(state.asking?.question).toBe(0);
  });

  test("moving back, seeking and the mode Sleduj never ask", () => {
    expect(run(predicting(), { type: "seek", index: 2 }).asking).toBeNull();
    expect(run(predicting(), { type: "seek", index: 3 }, { type: "step", delta: -1 }).asking).toBeNull();
    const watching = run(createPlayerState(null, "random", steps, questions), { type: "step", delta: 1 }, { type: "step", delta: 1 });
    expect(watching).toMatchObject({ index: 2, asking: null });
  });

  test("going back from an open question leaves it unanswered", () => {
    const state = run(predicting(), { type: "seek", index: 1 }, { type: "step", delta: 1 }, { type: "step", delta: -1 });
    expect(state).toMatchObject({ index: 1, asking: null, results: {} });
  });

  test("a second answer to the same question is ignored", () => {
    const state = run(predicting(), { type: "seek", index: 1 }, { type: "step", delta: 1 }, { type: "answer", reply: false }, {
      type: "answer",
      reply: true,
    });
    expect(state.results[0]).toEqual({ reply: false, correct: false });
  });

  test("new input brings new questions and forgets the old results", () => {
    let state = run(predicting(), { type: "seek", index: 1 }, { type: "step", delta: 1 }, { type: "answer", reply: true });
    state = run(state, { type: "load", input: null, inputKind: "custom", steps, questions: [question(1)] });
    expect(state).toMatchObject({ index: 0, results: {}, asking: null, mode: "predict" });
    expect(run(state, { type: "step", delta: 1 }).asking?.question).toBe(0);
  });
});

describe("checking answers", () => {
  test("pick: one click, any of the right ids", () => {
    const answer: Answer = { kind: "pick", correct: ["B", "C"] };
    expect(isCorrect(answer, ["C"])).toBe(true);
    expect(isCorrect(answer, ["D"])).toBe(false);
    expect(isCorrect(answer, ["B", "C"])).toBe(false);
  });

  test("sequence: the same ids in the same order; nothing means none", () => {
    expect(isCorrect({ kind: "sequence", correct: ["B", "D"] }, ["B", "D"])).toBe(true);
    expect(isCorrect({ kind: "sequence", correct: ["B", "D"] }, ["D", "B"])).toBe(false);
    expect(isCorrect({ kind: "sequence", correct: [] }, [])).toBe(true);
  });

  test("yes / no", () => {
    expect(isCorrect({ kind: "yes-no", correct: false }, false)).toBe(true);
    expect(isCorrect({ kind: "yes-no", correct: false }, ["x"])).toBe(false);
  });

  test("marks of the picture before and after the answer", () => {
    const onPick = () => {};
    expect(pickClass("3", { onPick, chosen: [] })).toBe("pickable");
    expect(pickClass("3", { onPick, chosen: ["3"] })).toBe("pick-chosen");
    expect(pickClass("3", { chosen: ["3"], correct: ["5"] })).toBe("pick-wrong");
    expect(pickClass("5", { chosen: ["3"], correct: ["5"] })).toBe("pick-right");
    expect(pickClass("4", { chosen: ["3"], correct: ["5"] })).toBe("");
  });
});
