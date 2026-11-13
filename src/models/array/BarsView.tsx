"use client";

import { VizBars } from "@/components/VizBars";
import { pickClass } from "@/core/prediction";
import type { PredictionView } from "@/core/types";
import type { ArrayState } from "./types";

/** Up to this size the values are written under the bars; bigger arrays would overlap. */
const MAX_LABELED = 24;

/** Player stage of the array model: one bar per value, coloured by its mark. During a question the bars can be clicked. */
export function BarsView({ state, prediction }: { state: unknown; prediction?: PredictionView }) {
  const { values, marks } = state as ArrayState;
  const onPick = prediction?.onPick;
  return (
    <VizBars
      values={values}
      classOf={(i) => marks[i] ?? ""}
      labels={values.length <= MAX_LABELED}
      minHeight={8}
      onBarClick={onPick && ((i) => onPick(String(i)))}
      extraClassOf={prediction && ((i) => pickClass(String(i), prediction))}
    />
  );
}
