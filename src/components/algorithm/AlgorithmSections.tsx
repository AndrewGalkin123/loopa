import { MousePointerClick } from "lucide-react";
import type { AlgorithmContent } from "@/algorithms/types";
import type { Locale } from "@/i18n/config";
import { messagesFor } from "@/i18n/messages";
import { makeTranslator } from "@/i18n/translate";
import { CodeTabs } from "./CodeTabs";
import { ContentTabs } from "./ContentTabs";
import { Pseudocode, StaticPseudocode } from "./Pseudocode";

/**
 * The texts under the player: description, pseudocode, implementations, complexity.
 * Shared by the algorithm page and the research session, where both conditions get
 * the same texts; only the control one has the pseudocode without the player.
 */
export function AlgorithmSections({ content, locale, linkedToPlayer }: {
  content: AlgorithmContent;
  /** The language of the headings (the research session has no language in its address, so it is passed in). */
  locale: Locale;
  /** The pseudocode highlights the current step and clicking a line moves the player. */
  linkedToPlayer: boolean;
}) {
  const { t } = makeTranslator(locale, messagesFor(locale));
  const tabs = [
    { id: "popis", label: t("sections.description") },
    { id: "pseudokod", label: t("sections.pseudocode") },
    { id: "implementace", label: t("sections.implementation") },
    { id: "slozitost", label: t("sections.complexity") },
  ];
  return (
    <section className="content-section">
      <ContentTabs tabs={tabs} />

      <article className="article" id="popis">
        <div className="prose">{content.description}</div>
      </article>

      <div id="pseudokod">
        <div className="block-title">02 / {t("sections.pseudocode")}</div>
        {linkedToPlayer ? (
          <>
            <Pseudocode lines={content.pseudocode} />
            <div className="pseudo-hint">
              <MousePointerClick /> {t("sections.pseudoHint")}
            </div>
          </>
        ) : (
          <StaticPseudocode lines={content.pseudocode} />
        )}
      </div>

      <div id="implementace">
        <div className="block-title">03 / {t("sections.implementation")}</div>
        <CodeTabs implementations={content.implementations} />
      </div>

      <div id="slozitost">
        <div className="block-title">04 / {t("sections.complexity")}</div>
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
