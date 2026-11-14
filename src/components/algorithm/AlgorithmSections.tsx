import { MousePointerClick } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import { CodeTabs } from "./CodeTabs";
import { ContentTabs } from "./ContentTabs";
import { Pseudocode, StaticPseudocode } from "./Pseudocode";

const TABS = [
  { id: "popis", label: "Popis" },
  { id: "pseudokod", label: "Pseudokód" },
  { id: "implementace", label: "Implementace" },
  { id: "slozitost", label: "Složitost" },
];

/**
 * The texts under the player: description, pseudocode, implementations, complexity.
 * Shared by the algorithm page and the research session, where both conditions get
 * the same texts; only the control one has the pseudocode without the player.
 */
export function AlgorithmSections({ content, linkedToPlayer }: {
  content: AlgorithmContent;
  /** The pseudocode highlights the current step and clicking a line moves the player. */
  linkedToPlayer: boolean;
}) {
  return (
    <section className="content-section">
      <ContentTabs tabs={TABS} />

      <article className="article" id="popis">
        <div className="prose">{content.description}</div>
      </article>

      <div id="pseudokod">
        <div className="block-title">02 / Pseudokód</div>
        {linkedToPlayer ? (
          <>
            <Pseudocode lines={content.pseudocode} />
            <div className="pseudo-hint">
              <MousePointerClick /> Klikni na&nbsp;řádek a&nbsp;přehrávač skočí na&nbsp;odpovídající krok.
            </div>
          </>
        ) : (
          <StaticPseudocode lines={content.pseudocode} />
        )}
      </div>

      <div id="implementace">
        <div className="block-title">03 / Implementace</div>
        <CodeTabs implementations={content.implementations} />
      </div>

      <div id="slozitost">
        <div className="block-title">04 / Složitost</div>
        <div className="cx-table">
          {content.complexityCases.map((row) => (
            <div key={`${row.label}-${row.sub}`} className={row.tone ? `cx-row ${row.tone}` : "cx-row"}>
              <div className="case">
                {row.label}
                <span className="sub">{row.sub}</span>
              </div>
              <div className="big-o">{row.bigO}</div>
              <div className="note">{row.note}</div>
            </div>
          ))}
        </div>
        {content.complexityChart && <div className="chart-wrap">{content.complexityChart}</div>}
      </div>
    </section>
  );
}
