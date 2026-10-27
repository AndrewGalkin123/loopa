import type { ReactNode } from "react";
import type { AlgorithmCardData } from "@/components/AlgorithmCard";

/**
 * The long texts of an algorithm page (rendered on the server).
 * Name, complexity, level, the player etc. are in the algorithm's definition.ts.
 */
export interface AlgorithmContent {
  readMinutes: number;
  lede: ReactNode;
  compareWith: { name: string; complexity: string; href: string }[];
  /** Body of the "01 / Popis" section. */
  description: ReactNode;
  pseudocode: ReactNode[];
  implementations: { id: string; label: string; lines: ReactNode[] }[];
  complexityCases: {
    label: string;
    sub: string;
    bigO: string;
    note: ReactNode;
    tone?: "good" | "bad";
  }[];
  complexityChart: ReactNode;
  /** Slugs of the catalog cards shown under "související" (see src/lib/catalog.ts). */
  related: string[];
  /** The last "related" card: a big link to the next algorithm to study. */
  next: { name: string; group: string; badge: AlgorithmCardData["badge"]; complexity: string; level: string; href: string };
}
