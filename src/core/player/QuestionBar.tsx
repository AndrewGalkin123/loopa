import { ArrowRight, Check, X } from "lucide-react";
import type { Question, Reply } from "@/core/types";
import { Note } from "./Note";
import type { QuestionResult } from "./playerState";

/**
 * The question of the mode Předpověz, between the player head and the picture:
 * first the question and how to answer it, after the answer whether it was right and why.
 */
export function QuestionBar({ question, result, chosen, onReply, onNext }: {
  question: Question;
  result: QuestionResult | undefined;
  /** Vertices clicked so far (a question answered by a sequence of clicks). */
  chosen: string[];
  onReply: (reply: Reply) => void;
  /** Skip the question, or go on after the answer. */
  onNext: () => void;
}) {
  const { answer } = question;

  if (result) {
    return (
      <div className={result.correct ? "question-bar right" : "question-bar wrong"} role="status">
        <span className="q-label">
          {result.correct ? <Check size={14} /> : <X size={14} />} {result.correct ? "Správně" : "Špatně"}
        </span>
        <span className="q-text">
          {answer.kind === "yes-no" && !result.correct && <strong>Správně je {answer.correct ? "ano" : "ne"}. </strong>}
          <Note parts={question.explain} />
        </span>
        <span className="q-actions">
          <button className="btn btn-primary btn-sm" onClick={onNext}>
            Pokračovat <ArrowRight size={13} />
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="question-bar">
      <span className="q-label">Předpověz</span>
      <span className="q-text">
        <Note parts={question.prompt} />
      </span>
      <span className="q-actions">
        {answer.kind === "yes-no" && (
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => onReply(true)}>
              Ano
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => onReply(false)}>
              Ne
            </button>
          </>
        )}
        {answer.kind === "sequence" && (
          <>
            <span className="q-chosen">{chosen.length > 0 ? chosen.join(" → ") : "nic"}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => onReply(chosen)}>
              {chosen.length > 0 ? "Hotovo" : "Žádný"}
            </button>
          </>
        )}
        <button className="btn btn-ghost btn-sm" onClick={onNext} title="Přeskočit (→)">
          Přeskočit
        </button>
      </span>
    </div>
  );
}
