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
    default: { color: "var(--viz-default)", desc: "neaktivní" },
    active: { color: "var(--viz-active)", desc: "právě teď" },
    compared: { color: "var(--viz-compared)", desc: "porovnání" },
    pivot: { color: "var(--viz-pivot)", desc: "pivot" },
    sorted: { color: "var(--viz-sorted)", desc: "hotovo" },
    dimmed: { color: "var(--viz-default)", desc: "mimo úsek", dim: true },
  },
};
