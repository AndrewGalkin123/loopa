import type { Metadata } from "next";
import { CONTENT } from "@/algorithms/content";
import { AlgorithmSections } from "@/components/algorithm/AlgorithmSections";
import { StudySession, type StudyTexts } from "@/components/study/StudySession";
import { VARIANTS } from "@/lib/study";
import "../[lang]/(site)/algorithms/[slug]/algorithm.css";
import "./study.css";

/*
 * The research session of VO2 (docs/research/01-ramec-vyzkumu.md, 4.6), for the
 * researcher and the participant. It is outside the (site) route group: no site
 * navigation, so the participant stays on the page. Not linked from the site.
 */

export const metadata: Metadata = {
  title: "Výzkumné sezení — Loopa",
  robots: { index: false, follow: false },
};

export default function StudyPage() {
  // The same texts in both conditions; only the pseudocode of the trainer follows the player.
  const texts: Record<string, StudyTexts> = Object.fromEntries(
    Object.values(VARIANTS)
      .flatMap((variant) => variant.algorithms)
      .map((slug) => [
        slug,
        {
          lede: CONTENT[slug].cs.lede,
          trainer: <AlgorithmSections content={CONTENT[slug].cs} locale="cs" linkedToPlayer />,
          control: <AlgorithmSections content={CONTENT[slug].cs} locale="cs" linkedToPlayer={false} />,
        },
      ]),
  );
  return <StudySession texts={texts} />;
}
