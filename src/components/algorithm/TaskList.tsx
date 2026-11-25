"use client";

import { Check, Circle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/core/player/PlayerProvider";
import { forgetSolved, markSolved, useSolved } from "./taskProgress";

/**
 * Tasks "find an input such that …" under the player. Every change of the input
 * records a new run, and every task is checked on it. A solved task stays ticked.
 */
export function TaskList() {
  const { state, definition } = usePlayer();
  const tasks = definition.tasks;
  const solved = useSolved(definition.slug);
  const checks = useMemo(() => tasks?.map((task) => task.check(state.input, state.steps)) ?? [], [tasks, state.input, state.steps]);
  const [hints, setHints] = useState<string[]>([]);

  // An input that solves a task is remembered in the browser.
  useEffect(() => {
    tasks?.forEach((task, i) => {
      if (checks[i].done) markSolved(definition.slug, task.id);
    });
  }, [tasks, checks, definition.slug]);

  if (!tasks || tasks.length === 0) return null;
  const isSolved = (i: number) => checks[i].done || solved.includes(tasks[i].id);
  const count = tasks.filter((_, i) => isSolved(i)).length;

  return (
    <section className="tasks">
      <div className="tasks-head">
        <div className="block-title">Úkoly</div>
        <span className="tasks-count">
          {count} / {tasks.length} splněno
        </span>
        {count > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={() => forgetSolved(definition.slug)}>
            Začít znovu
          </button>
        )}
      </div>
      <p className="tasks-intro">Změň vstup v&nbsp;přehrávači (data, velikost, graf) a&nbsp;úkol se zkontroluje sám.</p>
      <ol className="task-list">
        {tasks.map((task, i) => {
          const done = isSolved(i);
          const hintOpen = hints.includes(task.id);
          return (
            <li key={task.id} className={done ? "task solved" : "task"}>
              <span className="mark">{done ? <Check size={16} /> : <Circle size={16} />}</span>
              <div className="body">
                <div className="text">{task.text}</div>
                {done ? (
                  <div className="explain">{task.explain}</div>
                ) : (
                  <div className="meta">
                    {checks[i].status && <span className="status">{checks[i].status}</span>}
                    <button
                      className="link"
                      aria-expanded={hintOpen}
                      onClick={() => setHints(hintOpen ? hints.filter((id) => id !== task.id) : [...hints, task.id])}
                    >
                      Nápověda
                    </button>
                    {task.impossible && (
                      <button className="btn btn-secondary btn-sm" onClick={() => markSolved(definition.slug, task.id)}>
                        Myslím, že to nejde
                      </button>
                    )}
                  </div>
                )}
                {!done && hintOpen && <div className="hint">{task.hint}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
