import type { ReactNode } from "react";
import type { Localized } from "@/i18n/config";
import { ABOUT_CS } from "./about.cs";
import { ABOUT_EN } from "./about.en";

/* The texts of the About page by language; the page itself (../about/page.tsx) holds only the layout. */

export interface AboutTexts {
  metaTitle: string;
  title: string;
  lede: ReactNode;
  story: { title: ReactNode; paragraphs: ReactNode[]; author: string; kind: string; kindValue: string; year: string; count: string; growing: string };
  mission: { title: ReactNode; principles: { title: ReactNode; text: ReactNode }[] };
  stack: { title: ReactNode; intro: ReactNode };
  status: { title: ReactNode; done: string; doneItems: ReactNode[]; next: string; nextItems: ReactNode[] };
  connect: { title: ReactNode; text: string };
  final: { title: ReactNode; algorithms: string; compare: string; signoff: string };
  ask: string;
  askAria: string;
}

export const ABOUT: Localized<AboutTexts> = { cs: ABOUT_CS, en: ABOUT_EN };
