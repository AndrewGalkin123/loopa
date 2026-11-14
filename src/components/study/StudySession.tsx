"use client";

import { Download, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { findAlgorithm } from "@/algorithms/registry";
import {
  BLOCK_SECONDS,
  CONDITION_LABELS,
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
  VARIANTS,
  type BlockRecord,
  type Forms,
  type Group,
  type Session,
  type Variant,
} from "@/lib/study";
import { setSession, updateSession, useSession } from "./sessionStore";
import { clock, StudyBlock } from "./StudyBlock";

/** The texts of one algorithm for both conditions, rendered on the server. */
export interface StudyTexts {
  lede: ReactNode;
  trainer: ReactNode;
  control: ReactNode;
}

const nameOf = (slug: string) => findAlgorithm(slug)!.name;
const blockLabel = (block: { algorithm: string; condition: keyof typeof CONDITION_LABELS }) =>
  `${nameOf(block.algorithm)} — ${CONDITION_LABELS[block.condition]}`;

/**
 * The research session (VO2): the researcher sets it up, the participant studies two
 * blocks, the researcher downloads the log. Which screen is shown follows from the
 * session saved in the browser, so a reload continues where it was.
 */
export function StudySession({ texts }: { texts: Record<string, StudyTexts> }) {
  const session = useSession();
  const current = session ? stage(session) : null;
  const running = current?.kind === "block" ? current.block : null;

  // A running block that was not started in this page load was interrupted by a reload.
  const startedHere = useRef<number | null>(null);
  useEffect(() => {
    if (running === null || startedHere.current === running) return;
    startedHere.current = running;
    // A block whose time ran out during the reload just ends (StudyBlock), without a resume.
    updateSession((s) => {
      const left = BLOCK_SECONDS * 1000 - (Date.now() - s.blocks[running].startedAt!);
      return left > 0 ? recordEvents(s, running, [{ type: "resume" }], Date.now()) : s;
    });
  }, [running]);

  const start = (index: number) => {
    startedHere.current = index;
    updateSession((s) => startBlock(s, index, Date.now()));
  };
  const end = useCallback(
    (endedBy: "time" | "researcher") => {
      if (running === null) return;
      updateSession((s) => (s.blocks[running].seconds === null ? endBlock(s, running, Date.now(), endedBy) : s));
    },
    [running],
  );

  // On the server the saved session is not known yet.
  if (session === undefined) return null;
  if (session === null) {
    return (
      <Setup
        onStart={(fresh) => {
          startedHere.current = 0;
          setSession(startBlock(fresh, 0, Date.now()));
        }}
      />
    );
  }
  if (current!.kind === "block") {
    const block = session.blocks[running!];
    const text = texts[block.algorithm];
    return (
      <StudyBlock
        key={running}
        block={block}
        lede={text.lede}
        texts={block.condition === "trainer" ? text.trainer : text.control}
        onAction={(action, state) => updateSession((s) => recordEvents(s, running!, eventsOf(action, state), Date.now()))}
        onEnd={end}
      />
    );
  }
  if (current!.kind === "between") return <Between session={session} next={current!.block} onStart={start} />;
  return <Done session={session} />;
}

/** The researcher enters the participant and the arrangement of the session. */
function Setup({ onStart }: { onStart: (session: Session) => void }) {
  const [participant, setParticipant] = useState("");
  const [variant, setVariant] = useState<Variant>("vs");
  const [group, setGroup] = useState<Group>("A");
  const [forms, setForms] = useState<Forms>("AB");
  const valid = PARTICIPANT_ID.test(participant);
  const [first, second] = planBlocks(variant, group);

  return (
    <Screen>
      <div className="section-marker">výzkum · VO2</div>
      <h1>Výzkumné sezení</h1>
      <p className="study-note">
        Stránka pro výzkumníka. Log zůstává jen v&nbsp;tomto prohlížeči, dokud ho na&nbsp;konci nestáhnete; neobsahuje
        jméno, jen kód účastníka.
      </p>
      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (valid) onStart(newSession(participant, variant, group, forms, new Date()));
        }}
      >
        <label className="study-field">
          <span className="flabel">ID účastníka</span>
          <input
            className={participant && !valid ? "input-mono invalid" : "input-mono"}
            value={participant}
            placeholder="P07"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setParticipant(event.target.value.trim().toUpperCase())}
          />
          {participant && !valid && <span className="field-error">Jen kód ve tvaru P + číslo, např. P07 — nikdy jméno.</span>}
        </label>
        <Choice
          label="Varianta"
          value={variant}
          onChange={setVariant}
          options={(Object.keys(VARIANTS) as Variant[]).map((id) => ({
            id,
            label: `${VARIANTS[id].label}: ${VARIANTS[id].algorithms.map(nameOf).join(" → ")}`,
          }))}
        />
        <Choice
          label="Skupina"
          value={group}
          onChange={setGroup}
          options={(["A", "B"] as Group[]).map((id) => ({
            id,
            label: `${id}: ${planBlocks(variant, id).map((b) => CONDITION_LABELS[b.condition]).join(", pak ")}`,
          }))}
        />
        <Choice
          label="Pořadí forem testu"
          value={forms}
          onChange={setForms}
          options={[
            { id: "AB", label: "pretest A, posttest B" },
            { id: "BA", label: "pretest B, posttest A" },
          ]}
        />
        <p className="study-note">
          Blok 1: {blockLabel(first)} · blok 2: {blockLabel(second)} · každý {BLOCK_SECONDS / 60} minut.
        </p>
        <button className="btn btn-primary" type="submit" disabled={!valid}>
          Začít blok 1: {blockLabel(first)}
        </button>
      </form>
    </Screen>
  );
}

function Choice<T extends string>({ label, value, onChange, options }: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <fieldset className="study-field">
      <legend>{label}</legend>
      {options.map((option) => (
        <label key={option.id} className="study-radio">
          <input type="radio" name={label} checked={value === option.id} onChange={() => onChange(option.id)} />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

/** Between the blocks: the participant writes the tests on paper. */
function Between({ session, next, onStart }: { session: Session; next: number; onStart: (index: number) => void }) {
  const previous = session.blocks[next - 1];
  return (
    <Screen>
      <h1>{previous?.endedBy === "time" ? "Čas vypršel" : "Blok skončil"}</h1>
      <p className="lede">Řekněte to prosím výzkumníkovi.</p>
      <Blocks session={session} />
      <p className="study-note">Pro výzkumníka: účastník teď píše posttest a&nbsp;pretest dalšího algoritmu.</p>
      <div className="study-actions">
        <button className="btn btn-primary" onClick={() => onStart(next)}>
          Začít blok {next + 1}: {blockLabel(session.blocks[next])}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            if (window.confirm(`Zrušit sezení ${session.participant}? Jeho log se smaže.`)) setSession(null);
          }}
        >
          Zrušit sezení
        </button>
      </div>
    </Screen>
  );
}

/** The end: the researcher checks the numbers, downloads the log and deletes it from the browser. */
function Done({ session }: { session: Session }) {
  const download = () => {
    const file = new Blob([JSON.stringify(exportSession(session), null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${session.participant}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Screen>
      <h1>Hotovo, děkujeme</h1>
      <p className="lede">Obě části studia jsou za&nbsp;vámi. Řekněte to prosím výzkumníkovi.</p>
      <Blocks session={session} />
      <div className="study-actions">
        <button className="btn btn-primary" onClick={download}>
          <Download size={15} /> Stáhnout log {session.participant}.json
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (window.confirm("Smazat log z tohoto prohlížeče? Stáhli jste ho?")) setSession(null);
          }}
        >
          <Trash2 size={15} /> Smazat data z prohlížeče
        </button>
      </div>
    </Screen>
  );
}

/** Both blocks: what, how long, and for a finished trainer block the four measures (part 4.7). */
function Blocks({ session }: { session: Session }) {
  return (
    <div className="study-blocks">
      <div className="study-who">
        {session.participant} · {VARIANTS[session.variant].label} · skupina {session.group} ·{" "}
        {session.forms === "AB" ? "pre A / post B" : "pre B / post A"}
      </div>
      {session.blocks.map((block, i) => (
        <div className="study-block" key={i}>
          <div className="title">
            Blok {i + 1}: {blockLabel(block)}
          </div>
          <div className="meta">{blockState(block)}</div>
          {block.condition === "trainer" && block.seconds !== null && <Measures block={block} />}
        </div>
      ))}
    </div>
  );
}

function blockState(block: BlockRecord) {
  if (block.seconds === null) return "čeká";
  return `${clock(block.seconds)} min · ${block.endedBy === "time" ? "vypršel čas" : "ukončil výzkumník"}`;
}

function Measures({ block }: { block: BlockRecord }) {
  const s = summarize(block.events, block.seconds!);
  return (
    <dl className="measures">
      <dt>kroky vpřed / zpět</dt>
      <dd>
        {s.forward} / {s.back}
      </dd>
      <dt>předpovědi správně / zodpovězeno</dt>
      <dd>
        {s.correct} / {s.predictions} (přeskočeno {s.skipped})
      </dd>
      <dt>čas Sleduj / Předpověz</dt>
      <dd>
        {clock(s.secondsWatch)} / {clock(s.secondsPredict)}
      </dd>
      <dt>vlastní / připravené vstupy</dt>
      <dd>
        {s.customInputs} / {s.presetInputs}
      </dd>
    </dl>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="page-algorithm page-study">
      <main className="study-screen">{children}</main>
    </div>
  );
}
