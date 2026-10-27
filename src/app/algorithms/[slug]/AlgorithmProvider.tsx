"use client";

import type { ReactNode } from "react";
import { findAlgorithm } from "@/algorithms/registry";
import { PlayerProvider } from "@/core/player/PlayerProvider";
import { MODELS } from "@/models";

/**
 * Connects the generic player with one algorithm. The server page can pass only
 * the slug (functions such as trace() cannot travel from the server to the browser),
 * so the definition and its model are looked up here, in the browser.
 */
export function AlgorithmProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const definition = findAlgorithm(slug);
  if (!definition) throw new Error(`Unknown algorithm "${slug}"`);
  return (
    <PlayerProvider definition={definition} model={MODELS[definition.model]}>
      {children}
    </PlayerProvider>
  );
}
