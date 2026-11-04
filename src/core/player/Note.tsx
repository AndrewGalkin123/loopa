import { Fragment } from "react";
import type { NotePart } from "@/core/types";

/** Status line of a step: the parts joined by spaces, marked parts in the colour of their mark. */
export function Note({ parts }: { parts: NotePart[] }) {
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      {typeof part === "string" ? part : <span style={{ color: `var(--viz-${part.mark})` }}>{part.text}</span>}
    </Fragment>
  ));
}
