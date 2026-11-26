import type { ReactNode } from "react";
import type { Localized } from "@/i18n/config";
import { LANDING_CS } from "./landing.cs";
import { LANDING_EN } from "./landing.en";

/* The texts of the landing page by language; the page itself (../page.tsx) holds only the layout. */

export interface LandingTexts {
  hero: { title: ReactNode; lede: ReactNode; start: string; catalog: string };
  explore: { title: ReactNode; text: string; all: string };
  /** Descriptions of the six featured cards, in their order. */
  featured: string[];
  compare: { title: ReactNode; text: ReactNode; open: string; openFull: string };
  ai: {
    title: ReactNode;
    text: ReactNode;
    features: ReactNode[];
    tryIt: string;
    question1: string;
    answer1: ReactNode;
    question2: string;
    answer2: ReactNode;
    placeholder: ReactNode;
  };
  forYou: { title: ReactNode; text: ReactNode; crossed: string; claim: string };
  /** The three features A, B, C. */
  features: { title: string; em: string; text: string }[];
  final: { title: ReactNode; text: ReactNode; start: string; catalog: string };
}

export const LANDING: Localized<LandingTexts> = { cs: LANDING_CS, en: LANDING_EN };
