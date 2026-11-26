import type { Model } from "@/core/types";
import { ArrayDataMenu } from "./ArrayDataMenu";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { BarsView } from "./BarsView";

/** The array model: bars in the player, size / own input / random array in the side panel. */
export const arrayModel: Model = {
  View: BarsView,
  InputPanel: ArrayInputPanel,
  DataMenu: ArrayDataMenu,
  legend: {
    default: { color: "var(--viz-default)", desc: { cs: "neaktivní", en: "inactive" } },
    active: { color: "var(--viz-active)", desc: { cs: "právě teď", en: "right now" } },
    compared: { color: "var(--viz-compared)", desc: { cs: "porovnání", en: "compared" } },
    pivot: { color: "var(--viz-pivot)", desc: { cs: "pivot", en: "pivot" } },
    sorted: { color: "var(--viz-sorted)", desc: { cs: "hotovo", en: "done" } },
    dimmed: { color: "var(--viz-default)", desc: { cs: "mimo úsek", en: "outside the part" }, dim: true },
  },
};
