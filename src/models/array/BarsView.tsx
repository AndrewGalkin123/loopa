"use client";

import { VizBars } from "@/components/VizBars";
import type { ArrayState } from "./types";

/** Up to this size the values are written under the bars; bigger arrays would overlap. */
const MAX_LABELED = 24;

/** Player stage of the array model: one bar per value, coloured by its mark. */
export function BarsView({ state }: { state: unknown }) {
  const { values, marks } = state as ArrayState;
  return (
    <VizBars
      values={values}
      classOf={(i) => marks[i] ?? ""}
      labels={values.length <= MAX_LABELED}
      minHeight={8}
    />
  );
}
